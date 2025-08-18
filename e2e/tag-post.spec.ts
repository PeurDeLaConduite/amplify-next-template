import { test, expect } from "playwright/test";
import { tagService } from "@entities/models/tag/service";
import { postService } from "@src/entities/models/post/service";
import { authorService } from "@entities/models/author/service";
import { postTagService } from "@entities/relations/postTag/service";
import { signInUser, signOutUser, requireCredentials } from "./utils/auth";

test.describe("Tag & Post", () => {
    test("création de tag et post puis synchronisation", async () => {
        requireCredentials();
        await signInUser();

        // Création du tag
        const tagName = `e2e-tag-${Date.now()}`;
        const tagRes = await tagService.create({ name: tagName });
        const tagId = tagRes.data.id;

        // Récupération d'un auteur existant
        const authors = await authorService.list({ authMode: "apiKey" });
        expect(authors.data.length).toBeGreaterThan(0);
        const authorId = authors.data[0].id;

        // Création du post
        const postTitle = `E2E Post ${Date.now()}`;
        const postSlug = `e2e-post-${Date.now()}`;
        const postRes = await postService.create({
            title: postTitle,
            slug: postSlug,
            authorId,
        });
        const postId = postRes.data.id;

        // Association tag/post
        await postTagService.create(postId, tagId);

        // Vérifie la synchro des deux côtés via apiKey
        const tagIdsForPost = await postTagService.listByParent(postId, { authMode: "apiKey" });
        expect(tagIdsForPost).toContain(tagId);

        const postIdsForTag = await postTagService.listByChild(tagId, { authMode: "apiKey" });
        expect(postIdsForTag).toContain(postId);

        // Nettoyage
        await postTagService.delete(postId, tagId);
        await postService.delete({ id: postId });
        await tagService.delete({ id: tagId });
        await signOutUser();
    });
});

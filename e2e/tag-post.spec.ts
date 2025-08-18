import { test, expect } from "playwright/test";
import { signIn, signOut } from "@aws-amplify/auth";
import { tagService } from "@entities/models/tag/service";
import { postService } from "@src/entities/models/post/service";
import { authorService } from "@entities/models/author/service";
import { postTagService } from "@entities/relations/postTag/service";

// Ces tests nécessitent des identifiants d'un utilisateur admin
const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

const requireCredentials = () => {
    if (!email || !password) {
        test.skip(true, "Identifiants E2E manquants");
    }
};

test.describe("Tag & Post", () => {
    test("connexion apiKey vs userPool", async () => {
        // Lecture publique via apiKey
        const resApi = await tagService.list({ authMode: "apiKey" });
        expect(Array.isArray(resApi.data)).toBe(true);

        // Création sans connexion (mode userPool) -> échec
        await expect(tagService.create({ name: `e2e-auth-${Date.now()}` })).rejects.toThrow();

        if (email && password) {
            await signIn({ username: email, password });
            const tagName = `e2e-auth-${Date.now()}`;
            const created = await tagService.create({ name: tagName });
            expect(created.data.name).toBe(tagName);
            await tagService.delete({ id: created.data.id });
            await signOut();
        }
    });

    test("création de tag et post puis synchronisation", async () => {
        if (!email || !password) {
            test.skip(true, "Identifiants E2E manquants");
        }
        await signIn({ username: email!, password: password! });

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
        await signOut();
    });
});

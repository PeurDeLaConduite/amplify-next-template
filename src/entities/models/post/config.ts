import { postSchema, initialPostForm, toPostForm, toPostCreate, toPostUpdate } from "./form";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { authorService } from "@entities/models/author/service";
import { tagService } from "@entities/models/tag/service";
import { sectionService } from "@entities/models/section/service";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { type AuthorType } from "@entities/models/author/types";
import { type TagType } from "@entities/models/tag/types";
import { type SectionTypes } from "@entities/models/section/types";
import { type PostFormType, type PostType } from "@entities/models/post/types";

export type PostExtras = {
    authors: AuthorType[];
    tags: TagType[];
    sections: SectionTypes[];
};

export const postConfig = {
    auth: "admin",
    identifier: "id",
    fields: [
        "slug",
        "title",
        "excerpt",
        "content",
        "videoUrl",
        "authorId",
        "order",
        "type",
        "status",
        "seo",
    ],
    relations: ["author", "tags", "sections", "comments"],
    zodSchema: postSchema,
    toForm: toPostForm,
    toCreate: toPostCreate,
    toUpdate: toPostUpdate,
    initialForm: initialPostForm,
    initialExtras: { authors: [], tags: [], sections: [] } as PostExtras,
    create: async (form: PostFormType) => {
        const { tagIds, sectionIds, ...postInput } = form;
        void tagIds;
        void sectionIds;
        const { data } = await postService.create({
            ...postInput,
            seo: form.seo,
        });
        if (!data) throw new Error("Erreur lors de la création de l'article");
        return data.id;
    },
    update: async (form: PostFormType, post: PostType | null) => {
        if (!post?.id) {
            throw new Error("ID du post manquant pour la mise à jour");
        }
        const { tagIds, sectionIds, ...postInput } = form;
        void tagIds;
        void sectionIds;
        const { data } = await postService.update({
            id: post.id,
            ...postInput,
            seo: form.seo,
        });
        if (!data) throw new Error("Erreur lors de la mise à jour de l'article");
        return data.id;
    },
    syncRelations: async (id: string, form: PostFormType) => {
        const [currentTagIds, currentSectionIds] = await Promise.all([
            postTagService.listByParent(id),
            sectionPostService.listByChild(id),
        ]);
        await Promise.all([
            syncManyToMany(
                currentTagIds,
                form.tagIds,
                (tagId) => postTagService.create(id, tagId),
                (tagId) => postTagService.delete(id, tagId)
            ),
            syncManyToMany(
                currentSectionIds,
                form.sectionIds,
                (sectionId) => sectionPostService.create(sectionId, id),
                (sectionId) => sectionPostService.delete(sectionId, id)
            ),
        ]);
    },
    loadExtras: async () => {
        const [a, t, s] = await Promise.all([
            authorService.list(),
            tagService.list(),
            sectionService.list(),
        ]);
        return {
            authors: a.data ?? [],
            tags: t.data ?? [],
            sections: s.data ?? [],
        };
    },
    load: async (post: PostType) => {
        const [tagIds, sectionIds] = await Promise.all([
            postTagService.listByParent(post.id),
            sectionPostService.listByChild(post.id),
        ]);
        return toPostForm(post, tagIds, sectionIds);
    },
};

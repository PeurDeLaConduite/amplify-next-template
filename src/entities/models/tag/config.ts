import { tagSchema, initialTagForm, toTagForm, toTagCreate, toTagUpdate } from "./form";
import { tagService } from "@entities/models/tag/service";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { type TagFormType, type TagType } from "@entities/models/tag/types";
import { type PostType } from "@entities/models/post/types";

export type TagExtras = {
    tags: TagType[];
    posts: PostType[];
    postTags: { postId: string; tagId: string }[];
};

export const tagConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["name"],
    relations: ["posts"],
    zodSchema: tagSchema,
    toForm: toTagForm,
    toCreate: toTagCreate,
    toUpdate: toTagUpdate,
    initialForm: initialTagForm,
    initialExtras: { tags: [], posts: [], postTags: [] } as TagExtras,
    create: async (form: TagFormType) => {
        const { data } = await tagService.create({ name: form.name });
        if (!data) throw new Error("Erreur lors de la création du tag");
        return data.id;
    },
    update: async (form: TagFormType, tag: TagType | null) => {
        if (!tag?.id) throw new Error("ID du tag manquant pour la mise à jour");
        const { data } = await tagService.update({ id: tag.id, name: form.name });
        if (!data) throw new Error("Erreur lors de la mise à jour du tag");
        return data.id;
    },
    syncRelations: async (tagId: string, form: TagFormType) => {
        const currentPostIds = await postTagService.listByChild(tagId);
        await syncManyToMany(
            currentPostIds,
            form.postIds,
            (postId) => postTagService.create(postId, tagId),
            (postId) => postTagService.delete(postId, tagId)
        );
    },
    loadExtras: async () => {
        const [t, p, pt] = await Promise.all([
            tagService.list(),
            postService.list(),
            postTagService.list(),
        ]);
        return {
            tags: t.data ?? [],
            posts: p.data ?? [],
            postTags: (pt.data ?? []).map(({ postId, tagId }) => ({ postId, tagId })),
        };
    },
    load: async (tag: TagType) => {
        const postIds = await postTagService.listByChild(tag.id);
        return toTagForm(tag, postIds);
    },
};

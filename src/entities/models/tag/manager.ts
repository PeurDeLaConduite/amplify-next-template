// src/entities/models/tag/manager.ts
import { createManager, syncManyToMany as syncNN, type ManagerContract } from "@entities/core";
import { tagService } from "@entities/models/tag/service";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { initialTagForm, toTagForm, toTagCreate, toTagUpdate } from "@entities/models/tag/form";
import type { TagType, TagFormType } from "@entities/models/tag/types";
import type { PostType } from "@entities/models/post/types";

type Id = string;
type Extras = { posts: PostType[] };

export function createTagManager(): ManagerContract<TagType, TagFormType, Id, Extras> {
    return createManager<TagType, TagFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialTagForm }),
        listEntities: async ({ limit }) => {
            const { data, nextToken } = await tagService.list({ limit });
            return { items: data ?? [], nextToken };
        },
        getEntityById: async (id) => {
            const { data } = await tagService.get({ id });
            return data ?? null;
        },
        createEntity: async (data) => {
            const { data: created, errors } = await tagService.create(toTagCreate(data));
            if (!created) throw new Error(errors?.[0]?.message ?? "Création tag échouée");
            return created.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await tagService.update({
                id,
                ...toTagUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await tagService.deleteCascade({ id });
        },
        loadExtras: async () => {
            const { data } = await postService.list({ limit: 999 });
            return { posts: data ?? [] };
        },
        loadEntityForm: async (id) => {
            const tag = await tagService.get({ id }).then((r) => r.data ?? null);
            if (!tag) throw new Error("Tag introuvable");
            const postIds = await postTagService.listByChild(id);
            return toTagForm(tag, postIds);
        },
        syncManyToMany: async (id, link) => {
            const current = await postTagService.listByChild(id);
            const target = link.replace ?? [
                ...new Set([
                    ...current.filter((x) => !(link.remove ?? []).includes(x)),
                    ...(link.add ?? []),
                ]),
            ];
            await syncNN(
                current,
                target,
                (postId) => postTagService.create(postId, id),
                (postId) => postTagService.delete(postId, id)
            );
        },
        validateField: async () => null,
        validateForm: async () => ({ valid: true, errors: {} }),
    });
}

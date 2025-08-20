import { createManager } from "@entities/core";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import { tagService } from "./service";
import { initialTagForm, toTagForm, toTagCreate, toTagUpdate } from "./form";
import type { TagType, TagFormType } from "./types";

type Id = string;
type Extras = { posts: { id: string; title?: string }[] };

export function createTagManager() {
    return createManager<TagType, TagFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialTagForm }),
        listEntities: async ({ limit, nextToken }) => {
            const { data, nextToken: token } = await tagService.list({ limit, nextToken });
            return { items: (data ?? []) as TagType[], nextToken: token };
        },
        getEntityById: async (id) => {
            const { data } = await tagService.get({ id });
            return (data ?? null) as TagType | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await tagService.create(toTagCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, patch, { form }) => {
            const { errors } = await tagService.update({
                id,
                ...toTagUpdate({ ...form, ...patch }),
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
            const { data } = await tagService.get({ id });
            if (!data) throw new Error("Tag not found");
            const postIds = await postTagService.listByChild(id);
            return toTagForm(data as TagType, postIds);
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
        validateField: async (name, value, ctx) => {
            if (name !== "name") return null;
            const val = (value as string).trim();
            const { entities = [], editingId } = ctx ?? {};
            if (entities.some((t) => t.name === val && t.id !== editingId)) {
                return "Nom déjà utilisé";
            }
            const { data } = await tagService.list({
                filter: { name: { eq: val } },
                limit: 1,
            });
            const exists = (data ?? []).some((t) => t.id !== editingId);
            return exists ? "Nom déjà utilisé" : null;
        },
    });
}

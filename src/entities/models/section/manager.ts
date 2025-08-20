import { createManager } from "@entities/core";
import { sectionService } from "@entities/models/section/service";
import { postService } from "@entities/models/post/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import {
    initialSectionForm,
    toSectionForm,
    toSectionCreate,
    toSectionUpdate,
} from "@entities/models/section/form";
import type { SectionType, SectionFormTypes } from "@entities/models/section/types";
import type { PostType } from "@entities/models/post/types";

type Id = string;
type Extras = { posts: PostType[] };

export function createSectionManager() {
    return createManager<SectionType, SectionFormTypes, Id, Extras>({
        getInitialForm: () => ({ ...initialSectionForm }),
        listEntities: async ({ limit }) => {
            const { data } = await sectionService.list({ limit });
            return { items: (data ?? []) as SectionType[] };
        },
        getEntityById: async (id) => {
            const { data } = await sectionService.get({ id });
            return (data ?? null) as SectionType | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await sectionService.create(toSectionCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await sectionService.update({
                id,
                ...toSectionUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await sectionService.deleteCascade({ id });
        },
        loadExtras: async () => {
            const { data } = await postService.list({ limit: 999 });
            return { posts: data ?? [] };
        },
        loadEntityForm: async (id) => {
            const { data } = await sectionService.get({ id });
            if (!data) throw new Error("Section not found");
            const postIds = await sectionPostService.listByParent(id);
            return toSectionForm(data as SectionType, postIds);
        },
        syncManyToMany: async (id, link) => {
            const current = await sectionPostService.listByParent(id);
            const target = link.replace ?? [
                ...new Set([
                    ...current.filter((x) => !(link.remove ?? []).includes(x)),
                    ...(link.add ?? []),
                ]),
            ];
            await syncNN(
                current,
                target,
                (postId) => sectionPostService.create(id, postId),
                (postId) => sectionPostService.delete(id, postId)
            );
        },
    });
}

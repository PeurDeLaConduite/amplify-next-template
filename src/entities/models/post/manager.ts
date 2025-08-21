// src/entities/models/post/manager.ts
import { createManager } from "@entities/core";
import type { ManagerContract, MaybePromise } from "@entities/core/managerContract";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { authorService } from "@entities/models/author/service";
import { tagService } from "@entities/models/tag/service";
import { sectionService } from "@entities/models/section/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import {
    initialPostForm,
    toPostForm,
    toPostCreate,
    toPostUpdate,
} from "@entities/models/post/form";
import type { PostType, PostFormType } from "@entities/models/post/types";
import type { AuthorType } from "@entities/models/author/types";
import type { TagType } from "@entities/models/tag/types";
import type { SectionType } from "@entities/models/section/types";

type Id = string;
type Extras = { authors: AuthorType[]; tags: TagType[]; sections: SectionType[] };

export function createPostManager(): ManagerContract<PostType, PostFormType, Id, Extras> {
    return createManager<PostType, PostFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialPostForm }),
        listEntities: async ({ limit, nextToken }) => {
            const { data, nextToken: token } = await postService.list({
                limit,
                nextToken,
            });
            return { items: (data ?? []) as PostType[], nextToken: token };
        },
        getEntityById: async (id) => {
            const { data } = await postService.get({ id });
            return (data ?? null) as PostType | null;
        },
        createEntity: async (data) => {
            const { data: created, errors } = await postService.create(toPostCreate(data));
            if (errors?.length) throw new Error(errors[0].message);
            return created.id;
        },
        updateEntity: async (id, patch, { form }) => {
            const { errors } = await postService.update({
                id,
                ...toPostUpdate({ ...form, ...patch }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await postService.deleteCascade({ id });
        },
        loadExtras: async () => {
            const [a, t, s] = await Promise.all([
                authorService.list({ limit: 999 }),
                tagService.list({ limit: 999 }),
                sectionService.list({ limit: 999 }),
            ]);
            return {
                authors: a.data ?? [],
                tags: t.data ?? [],
                sections: s.data ?? [],
            };
        },
        loadEntityForm: async (id) => {
            const [{ data }, tagIds, sectionIds] = await Promise.all([
                postService.get({ id }),
                postTagService.listByParent(id),
                sectionPostService.listByChild(id),
            ]);
            if (!data) throw new Error("Post not found");
            return toPostForm(data as PostType, tagIds, sectionIds);
        },
        toForm: (entity) => toPostForm(entity, [], []),
        syncManyToMany: async (id, link, options) => {
            const relation = options?.relation ?? "tags";
            if (relation === "tags") {
                const current = await postTagService.listByParent(id);
                const target = link.replace ?? [
                    ...new Set([
                        ...current.filter((x) => !(link.remove ?? []).includes(x)),
                        ...(link.add ?? []),
                    ]),
                ];
                await syncNN(
                    current,
                    target,
                    (tagId) => postTagService.create(id, tagId),
                    (tagId) => postTagService.delete(id, tagId)
                );
            } else {
                const current = await sectionPostService.listByChild(id);
                const target = link.replace ?? [
                    ...new Set([
                        ...current.filter((x) => !(link.remove ?? []).includes(x)),
                        ...(link.add ?? []),
                    ]),
                ];
                await syncNN(
                    current,
                    target,
                    (sectionId) => sectionPostService.create(sectionId, id),
                    (sectionId) => sectionPostService.delete(sectionId, id)
                );
            }
        },
        validateField: <K extends keyof PostFormType>(
            _name: K,
            _value: PostFormType[K]
        ): MaybePromise<string | null> => null,
        validateForm: (): MaybePromise<{
            valid: boolean;
            errors: Partial<Record<keyof PostFormType, string>>;
        }> => ({ valid: true, errors: {} }),
    });
}

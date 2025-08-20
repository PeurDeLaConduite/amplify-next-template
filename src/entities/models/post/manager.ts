// src/entities/models/post/manager.ts
import type { ManagerContract, ListResult, MaybePromise } from "@entities/core/managerContract";
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
    // ------- état interne -------
    let entities: PostType[] = [];
    let form: PostFormType = { ...initialPostForm };
    let extras: Extras = { authors: [], tags: [], sections: [] };

    let editingId: Id | null = null;
    let isEditing = false;

    let loadingList = false,
        loadingEntity = false,
        loadingExtras = false;
    let errorList: Error | null = null,
        errorEntity: Error | null = null,
        errorExtras: Error | null = null;

    let savingCreate = false,
        savingUpdate = false,
        savingDelete = false;

    let pageSize = 20;
    const hasNext = false,
        hasPrev = false; // limit-only

    // ------- helpers -------
    const getInitialForm = () => ({ ...initialPostForm });

    const updateField = <K extends keyof PostFormType>(name: K, value: PostFormType[K]) => {
        form = { ...form, [name]: value };
    };

    const patchForm = (partial: Partial<PostFormType>) => {
        form = { ...form, ...partial };
    };

    const clearField = <K extends keyof PostFormType>(name: K) => {
        const init = getInitialForm();
        form = { ...form, [name]: init[name] };
    };

    const clearForm = () => {
        form = getInitialForm();
    };

    const enterEdit = (id: Id | null) => {
        editingId = id;
        isEditing = id !== null;
    };

    const cancelEdit = () => {
        clearForm();
        enterEdit(null);
    };

    // ------- data pur -------
    const listEntities = async (_?: { limit?: number }): Promise<ListResult<PostType>> => {
        const { data } = await postService.list({ limit: pageSize });
        return { items: (data ?? []) as PostType[] };
    };

    const getEntityById = async (id: Id) => {
        const { data } = await postService.get({ id });
        return data ?? null;
    };

    // ------- cycle de vie -------
    const refresh = async () => {
        loadingList = true;
        errorList = null;
        try {
            const { items } = await listEntities({ limit: pageSize });
            entities = items;
        } catch (e) {
            errorList = e as Error;
        } finally {
            loadingList = false;
        }
    };

    const refreshExtras = async () => {
        loadingExtras = true;
        errorExtras = null;
        try {
            const [a, t, s] = await Promise.all([
                authorService.list({ limit: 999 }),
                tagService.list({ limit: 999 }),
                sectionService.list({ limit: 999 }),
            ]);
            extras = {
                authors: a.data ?? [],
                tags: t.data ?? [],
                sections: s.data ?? [],
            };
        } catch (e) {
            errorExtras = e as Error;
        } finally {
            loadingExtras = false;
        }
    };

    const loadEntityById = async (id: Id) => {
        loadingEntity = true;
        errorEntity = null;
        try {
            const p = await getEntityById(id);
            if (!p) throw new Error("Post introuvable");
            const [tagIds, sectionIds] = await Promise.all([
                postTagService.listByParent(id),
                sectionPostService.listByChild(id),
            ]);
            form = toPostForm(p, tagIds, sectionIds);
            enterEdit(id);
        } catch (e) {
            errorEntity = e as Error;
        } finally {
            loadingEntity = false;
        }
    };

    // ------- CRUD (réseau) -------
    const createEntity = async (data: PostFormType) => {
        savingCreate = true;
        try {
            const { data: created, errors } = await postService.create(toPostCreate(data));
            if (!created) throw new Error(errors?.[0]?.message ?? "Création post échouée");
            await refresh();
            enterEdit(created.id);
            return created.id;
        } finally {
            savingCreate = false;
        }
    };

    const updateEntity = async (id: Id, data: Partial<PostFormType>) => {
        savingUpdate = true;
        try {
            const { errors } = await postService.update({
                id,
                ...toPostUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
            await refresh();
        } finally {
            savingUpdate = false;
        }
    };

    const deleteById = async (id: Id) => {
        savingDelete = true;
        try {
            await postService.deleteCascade({ id });
            if (editingId === id) cancelEdit();
            await refresh();
        } finally {
            savingDelete = false;
        }
    };

    // ------- relations N:N -------
    const syncManyToMany = async (
        id: Id,
        link: { add?: Id[]; remove?: Id[]; replace?: Id[] },
        options?: { relation?: "tags" | "sections" }
    ) => {
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
    };

    // ------- validation (stubs) -------
    const validateField = async <K extends keyof PostFormType>(
        _name: K,
        _value: PostFormType[K]
    ): MaybePromise<string | null> => null;

    const validateForm = async (): MaybePromise<{
        valid: boolean;
        errors: Partial<Record<keyof PostFormType, string>>;
    }> => ({ valid: true, errors: {} });

    // ------- snapshot -------
    const getState = () => ({
        entities,
        form,
        extras,
        editingId,
        isEditing,
        loadingList,
        loadingEntity,
        loadingExtras,
        errorList,
        errorEntity,
        errorExtras,
        savingCreate,
        savingUpdate,
        savingDelete,
        pageSize,
        hasNext,
        hasPrev,
    });

    return {
        getState,
        listEntities,
        getEntityById,
        refresh,
        refreshExtras,
        loadEntityById,
        createEntity,
        updateEntity,
        deleteById,
        getInitialForm,
        updateField,
        patchForm,
        clearField,
        clearForm,
        enterEdit,
        cancelEdit,
        syncManyToMany,
        validateField,
        validateForm,
    };
}

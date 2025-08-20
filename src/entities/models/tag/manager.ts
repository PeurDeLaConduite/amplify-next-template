// src/entities/models/tag/manager.ts
import type {
    ManagerContract,
    ManagerState,
    ListResult,
    MaybePromise,
} from "@entities/core/managerContract";
import { tagService } from "@entities/models/tag/service";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import { initialTagForm, toTagForm, toTagCreate, toTagUpdate } from "@entities/models/tag/form";
import type { TagType, TagFormType } from "@entities/models/tag/types";
import type { PostType } from "@entities/models/post/types";

type Id = string;
type Extras = { posts: PostType[] };

export function createTagManager(): ManagerContract<TagType, TagFormType, Id, Extras> {
    // ------- état interne -------
    let entities: TagType[] = [];
    let form: TagFormType = { ...initialTagForm };
    let extras: Extras = { posts: [] };

    let editingId: Id | null = null;
    let isEditing = false;

    let loadingList = false,
        loadingEntity = false,
        loadingExtras = false;
    let errorList: unknown = null,
        errorEntity: unknown = null,
        errorExtras: unknown = null;

    let savingCreate = false,
        savingUpdate = false,
        savingDelete = false;

    let pageSize = 20;
    const hasNext = false,
        hasPrev = false; // limit-only

    // ------- helpers -------
    const getInitialForm = () => ({ ...initialTagForm });

    const updateField = <K extends keyof TagFormType>(name: K, value: TagFormType[K]) => {
        form = { ...form, [name]: value };
    };

    const patchForm = (partial: Partial<TagFormType>) => {
        form = { ...form, ...partial };
    };

    const clearField = <K extends keyof TagFormType>(name: K) => {
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
    const listEntities = async (_?: { limit?: number }): Promise<ListResult<TagType>> => {
        const { data } = await tagService.list({ limit: pageSize });
        return { items: data ?? [] };
    };

    const getEntityById = async (id: Id) => {
        const { data } = await tagService.get({ id });
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
            errorList = e;
        } finally {
            loadingList = false;
        }
    };

    const refreshExtras = async () => {
        loadingExtras = true;
        errorExtras = null;
        try {
            const { data } = await postService.list({ limit: 999 });
            extras = { posts: data ?? [] };
        } catch (e) {
            errorExtras = e;
        } finally {
            loadingExtras = false;
        }
    };

    const loadEntityById = async (id: Id) => {
        loadingEntity = true;
        errorEntity = null;
        try {
            const t = await getEntityById(id);
            if (!t) throw new Error("Tag introuvable");
            const postIds = await postTagService.listByChild(id);
            form = toTagForm(t, postIds);
            enterEdit(id);
        } catch (e) {
            errorEntity = e;
        } finally {
            loadingEntity = false;
        }
    };

    // ------- CRUD (réseau) -------
    const createEntity = async (data: TagFormType) => {
        savingCreate = true;
        try {
            const { data: created, errors } = await tagService.create(toTagCreate(data));
            if (!created) throw new Error(errors?.[0]?.message ?? "Création tag échouée");
            await refresh();
            enterEdit(created.id);
            return created.id;
        } finally {
            savingCreate = false;
        }
    };

    const updateEntity = async (id: Id, data: Partial<TagFormType>) => {
        savingUpdate = true;
        try {
            const { errors } = await tagService.update({
                id,
                ...toTagUpdate({ ...form, ...data }),
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
            await tagService.deleteCascade({ id });
            if (editingId === id) cancelEdit();
            await refresh();
        } finally {
            savingDelete = false;
        }
    };

    // ------- relations N:N -------
    const syncManyToMany = async (id: Id, link: { add?: Id[]; remove?: Id[]; replace?: Id[] }) => {
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
    };

    // ------- validation (stubs) -------
    const validateField = async <K extends keyof TagFormType>(
        _name: K,
        _value: TagFormType[K]
    ): MaybePromise<string | null> => null;

    const validateForm = async (): MaybePromise<{
        valid: boolean;
        errors: Partial<Record<keyof TagFormType, string>>;
    }> => ({ valid: true, errors: {} });

    // ------- snapshot -------
    const getState = (): ManagerState<TagType, TagFormType, Extras> => ({
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
        // état
        getState,

        // data pur
        listEntities,
        getEntityById,

        // cycle de vie
        refresh,
        refreshExtras,
        loadEntityById,

        // CRUD
        createEntity,
        updateEntity,
        deleteById,

        // form local
        getInitialForm,
        updateField,
        patchForm,
        clearField,
        clearForm,
        enterEdit,
        cancelEdit,

        // relations & validation
        syncManyToMany,
        validateField,
        validateForm,
    };
}

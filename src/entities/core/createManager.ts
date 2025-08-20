// src/entities/core/createManager.ts
import type { ManagerContract, ManagerState, ListParams, ListResult } from "./managerContract";

export interface ManagerFactoryOptions<E, F, Id = string, Extras = Record<string, unknown>> {
    getInitialForm: () => F;
    listEntities: (params: ListParams) => Promise<ListResult<E>>;
    getEntityById: (id: Id) => Promise<E | null>;
    createEntity: (data: F) => Promise<Id>;
    updateEntity: (id: Id, data: Partial<F>, ctx: { form: F }) => Promise<void>;
    deleteById: (id: Id) => Promise<void>;
    loadExtras?: () => Promise<Extras>;
    loadEntityForm?: (id: Id) => Promise<F>;
    toForm?: (entity: E) => F | Promise<F>;
    pageSize?: number;
    syncManyToMany?: ManagerContract<E, F, Id, Extras>["syncManyToMany"];
    validateField?: ManagerContract<E, F, Id, Extras>["validateField"];
    validateForm?: ManagerContract<E, F, Id, Extras>["validateForm"];
}

export function createManager<E, F, Id = string, Extras = Record<string, unknown>>(
    options: ManagerFactoryOptions<E, F, Id, Extras>
): ManagerContract<E, F, Id, Extras> {
    const {
        getInitialForm,
        listEntities,
        getEntityById,
        createEntity: createNet,
        updateEntity: updateNet,
        deleteById: deleteNet,
        loadExtras,
        loadEntityForm,
        toForm,
        pageSize: initialPageSize = 20,
        syncManyToMany,
        validateField,
        validateForm,
    } = options;

    // ---- état interne ----
    let entities: E[] = [];
    let form: F = getInitialForm();
    let extras: Extras = {} as Extras;

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

    let pageSize = initialPageSize;
    let hasNext = false;
    const hasPrev = false; // limit-only pagination

    // ---- helpers ----
    const updateField = <K extends keyof F>(name: K, value: F[K]) => {
        form = { ...form, [name]: value };
    };

    const patchForm = (partial: Partial<F>) => {
        form = { ...form, ...partial };
    };

    const clearField = <K extends keyof F>(name: K) => {
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

    // ---- cycle de vie ----
    const refresh = async () => {
        loadingList = true;
        errorList = null;
        try {
            const { items, nextToken } = await listEntities({ limit: pageSize });
            entities = items;
            hasNext = Boolean(nextToken);
        } catch (e) {
            errorList = e;
        } finally {
            loadingList = false;
        }
    };

    const refreshExtras = async () => {
        if (!loadExtras) return;
        loadingExtras = true;
        errorExtras = null;
        try {
            extras = await loadExtras();
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
            let f: F;
            if (loadEntityForm) {
                f = await loadEntityForm(id);
            } else {
                const entity = await getEntityById(id);
                if (!entity) throw new Error("Entity not found");
                f = toForm ? await toForm(entity) : (entity as unknown as F);
            }
            form = f;
            enterEdit(id);
        } catch (e) {
            errorEntity = e;
        } finally {
            loadingEntity = false;
        }
    };

    // ---- CRUD ----
    const createEntity = async (data: F) => {
        savingCreate = true;
        try {
            const id = await createNet(data);
            await refresh();
            enterEdit(id);
            return id;
        } finally {
            savingCreate = false;
        }
    };

    const updateEntity = async (id: Id, data: Partial<F>) => {
        savingUpdate = true;
        try {
            await updateNet(id, data, { form });
            await refresh();
        } finally {
            savingUpdate = false;
        }
    };

    const deleteById = async (id: Id) => {
        savingDelete = true;
        try {
            await deleteNet(id);
            if (editingId === id) cancelEdit();
            await refresh();
        } finally {
            savingDelete = false;
        }
    };

    // ---- snapshot ----
    const getState = (): ManagerState<E, F, Extras> => ({
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

// src/entities/core/createManager.ts
// src/entities/core/createManager.ts
import type { ManagerContract, ListParams, ListResult, ManagerState } from "./managerContract";

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
    let errorList: Error | null = null,
        errorEntity: Error | null = null,
        errorExtras: Error | null = null;

    let savingCreate = false,
        savingUpdate = false,
        savingDelete = false;

    let pageSize = initialPageSize;
    let nextToken: string | null = null;
    let prevTokens: (string | null)[] = [];
    let hasNext = false;
    let hasPrev = false;

    let state: ManagerState<E, F, Extras, Id> = {
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
        nextToken,
        prevTokens,
    };

    const listeners = new Set<() => void>();
    const notify = () => {
        state = { ...state };
        listeners.forEach((l) => l());
    };

    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    // ---- helpers ----
    const updateField = <K extends keyof F>(name: K, value: F[K]) => {
        form = { ...form, [name]: value };
        state.form = form;
        notify();
    };

    const patchForm = (partial: Partial<F>) => {
        form = { ...form, ...partial };
        state.form = form;
        notify();
    };

    const clearField = <K extends keyof F>(name: K) => {
        const init = getInitialForm();
        form = { ...form, [name]: init[name] };
        state.form = form;
        notify();
    };

    const clearForm = () => {
        form = getInitialForm();
        state.form = form;
        notify();
    };

    const enterEdit = (id: Id | null) => {
        editingId = id;
        isEditing = id !== null;
        state.editingId = editingId;
        state.isEditing = isEditing;
        notify();
    };

    const cancelEdit = () => {
        clearForm();
        enterEdit(null);
    };

    // ---- cycle de vie ----
    const refresh = async () => {
        loadingList = true;
        errorList = null;
        state.loadingList = loadingList;
        state.errorList = errorList;
        notify();
        try {
            const { items, nextToken: token } = await listEntities({ limit: pageSize });
            entities = items;
            nextToken = token ?? null;
            prevTokens = [null];
            hasNext = nextToken !== null;
            hasPrev = prevTokens.length > 1;
            state.entities = entities;
            state.nextToken = nextToken;
            state.prevTokens = prevTokens;
            state.hasNext = hasNext;
            state.hasPrev = hasPrev;
            notify();
        } catch (e) {
            errorList = e as Error;
            state.errorList = errorList;
            notify();
        } finally {
            loadingList = false;
            state.loadingList = loadingList;
            notify();
        }
    };

    const loadNextPage = async () => {
        if (!nextToken) return;
        loadingList = true;
        errorList = null;
        state.loadingList = loadingList;
        state.errorList = errorList;
        notify();
        try {
            prevTokens.push(nextToken);
            const { items, nextToken: token } = await listEntities({
                limit: pageSize,
                nextToken,
            });
            entities = items;
            nextToken = token ?? null;
            hasNext = nextToken !== null;
            hasPrev = prevTokens.length > 1;
            state.entities = entities;
            state.nextToken = nextToken;
            state.hasNext = hasNext;
            state.hasPrev = hasPrev;
            state.prevTokens = prevTokens;
            notify();
        } catch (e) {
            errorList = e as Error;
            state.errorList = errorList;
            notify();
        } finally {
            loadingList = false;
            state.loadingList = loadingList;
            notify();
        }
    };

    const loadPrevPage = async () => {
        if (prevTokens.length <= 1) return;
        loadingList = true;
        errorList = null;
        state.loadingList = loadingList;
        state.errorList = errorList;
        notify();
        try {
            prevTokens.pop();
            const token = prevTokens[prevTokens.length - 1] ?? null;
            const { items, nextToken: tokenNext } = await listEntities({
                limit: pageSize,
                nextToken: token ?? undefined,
            });
            entities = items;
            nextToken = tokenNext ?? null;
            hasNext = nextToken !== null;
            hasPrev = prevTokens.length > 1;
            state.entities = entities;
            state.nextToken = nextToken;
            state.hasNext = hasNext;
            state.hasPrev = hasPrev;
            state.prevTokens = prevTokens;
            notify();
        } catch (e) {
            errorList = e as Error;
            state.errorList = errorList;
            notify();
        } finally {
            loadingList = false;
            state.loadingList = loadingList;
            notify();
        }
    };

    const refreshExtras = async () => {
        if (!loadExtras) return;
        loadingExtras = true;
        errorExtras = null;
        state.loadingExtras = loadingExtras;
        state.errorExtras = errorExtras;
        notify();
        try {
            extras = await loadExtras();
            state.extras = extras;
            notify();
        } catch (e) {
            errorExtras = e as Error;
            state.errorExtras = errorExtras;
            notify();
        } finally {
            loadingExtras = false;
            state.loadingExtras = loadingExtras;
            notify();
        }
    };

    const loadEntityById = async (id: Id) => {
        loadingEntity = true;
        errorEntity = null;
        state.loadingEntity = loadingEntity;
        state.errorEntity = errorEntity;
        notify();
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
            state.form = form;
            enterEdit(id);
            notify();
        } catch (e) {
            errorEntity = e as Error;
            state.errorEntity = errorEntity;
            notify();
        } finally {
            loadingEntity = false;
            state.loadingEntity = loadingEntity;
            notify();
        }
    };

    // ---- CRUD ----
    const createEntity = async (data: F) => {
        savingCreate = true;
        state.savingCreate = savingCreate;
        notify();
        try {
            const id = await createNet(data);
            await refresh();
            enterEdit(id);
            return id;
        } finally {
            savingCreate = false;
            state.savingCreate = savingCreate;
            notify();
        }
    };

    const updateEntity = async (id: Id, data: Partial<F>) => {
        savingUpdate = true;
        state.savingUpdate = savingUpdate;
        notify();
        try {
            await updateNet(id, data, { form });
            await refresh();
        } finally {
            savingUpdate = false;
            state.savingUpdate = savingUpdate;
            notify();
        }
    };

    const deleteById = async (id: Id) => {
        savingDelete = true;
        state.savingDelete = savingDelete;
        notify();
        try {
            await deleteNet(id);
            if (editingId === id) cancelEdit();
            await refresh();
        } finally {
            savingDelete = false;
            state.savingDelete = savingDelete;
            notify();
        }
    };

    // ---- snapshot ----
    const getState = (): ManagerState<E, F, Extras, Id> => state;

    return {
        getState,
        subscribe,
        get entities() {
            return entities;
        },
        get form() {
            return form;
        },
        get extras() {
            return extras;
        },
        get editingId() {
            return editingId;
        },
        get isEditing() {
            return isEditing;
        },
        get loadingList() {
            return loadingList;
        },
        get loadingEntity() {
            return loadingEntity;
        },
        get loadingExtras() {
            return loadingExtras;
        },
        get errorList() {
            return errorList;
        },
        get errorEntity() {
            return errorEntity;
        },
        get errorExtras() {
            return errorExtras;
        },
        get savingCreate() {
            return savingCreate;
        },
        get savingUpdate() {
            return savingUpdate;
        },
        get savingDelete() {
            return savingDelete;
        },
        get pageSize() {
            return pageSize;
        },
        get nextToken() {
            return nextToken;
        },
        get prevTokens() {
            return prevTokens;
        },
        get hasNext() {
            return hasNext;
        },
        get hasPrev() {
            return hasPrev;
        },
        loadNextPage,
        loadPrevPage,
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

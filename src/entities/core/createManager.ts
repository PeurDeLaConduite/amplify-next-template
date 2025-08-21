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
    let state: ManagerState<E, F, Extras, Id> = {
        entities: [],
        form: getInitialForm(),
        extras: {} as Extras,
        editingId: null,
        isEditing: false,
        loadingList: false,
        loadingEntity: false,
        loadingExtras: false,
        errorList: null,
        errorEntity: null,
        errorExtras: null,
        savingCreate: false,
        savingUpdate: false,
        savingDelete: false,
        pageSize: initialPageSize,
        hasNext: false,
        hasPrev: false,
        nextToken: null,
        prevTokens: [],
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
        state.form = { ...state.form, [name]: value };
        notify();
    };

    const patchForm = (partial: Partial<F>) => {
        state.form = { ...state.form, ...partial };
        notify();
    };

    const clearField = <K extends keyof F>(name: K) => {
        const init = getInitialForm();
        state.form = { ...state.form, [name]: init[name] };
        notify();
    };

    const clearForm = () => {
        state.form = getInitialForm();
        notify();
    };

    const enterEdit = (id: Id | null) => {
        state.editingId = id;
        state.isEditing = id !== null;
        notify();
    };

    const cancelEdit = () => {
        clearForm();
        enterEdit(null);
    };

    // ---- cycle de vie ----
    const refresh = async () => {
        state.loadingList = true;
        state.errorList = null;
        notify();
        try {
            const { items, nextToken: token } = await listEntities({ limit: state.pageSize });
            state.entities = items;
            state.nextToken = token ?? null;
            state.prevTokens = [null];
            state.hasNext = state.nextToken !== null;
            state.hasPrev = state.prevTokens.length > 1;
            notify();
        } catch (e) {
            state.errorList = e as Error;
            notify();
        } finally {
            state.loadingList = false;
            notify();
        }
    };

    const loadNextPage = async () => {
        if (!state.nextToken) return;
        state.loadingList = true;
        state.errorList = null;
        notify();
        try {
            state.prevTokens = [...state.prevTokens, state.nextToken];
            const { items, nextToken: token } = await listEntities({
                limit: state.pageSize,
                nextToken: state.nextToken,
            });
            state.entities = items;
            state.nextToken = token ?? null;
            state.hasNext = state.nextToken !== null;
            state.hasPrev = state.prevTokens.length > 1;
            notify();
        } catch (e) {
            state.errorList = e as Error;
            notify();
        } finally {
            state.loadingList = false;
            notify();
        }
    };

    const loadPrevPage = async () => {
        if (state.prevTokens.length <= 1) return;
        state.loadingList = true;
        state.errorList = null;
        notify();
        try {
            const prev = state.prevTokens.slice(0, -1);
            const token = prev[prev.length - 1] ?? null;
            const { items, nextToken: tokenNext } = await listEntities({
                limit: state.pageSize,
                nextToken: token ?? undefined,
            });
            state.entities = items;
            state.nextToken = tokenNext ?? null;
            state.hasNext = state.nextToken !== null;
            state.prevTokens = prev;
            state.hasPrev = state.prevTokens.length > 1;
            notify();
        } catch (e) {
            state.errorList = e as Error;
            notify();
        } finally {
            state.loadingList = false;
            notify();
        }
    };

    const refreshExtras = async () => {
        if (!loadExtras) return;
        state.loadingExtras = true;
        state.errorExtras = null;
        notify();
        try {
            state.extras = await loadExtras();
            notify();
        } catch (e) {
            state.errorExtras = e as Error;
            notify();
        } finally {
            state.loadingExtras = false;
            notify();
        }
    };

    const loadEntityById = async (id: Id) => {
        state.loadingEntity = true;
        state.errorEntity = null;
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
            state.form = f;
            enterEdit(id);
        } catch (e) {
            state.errorEntity = e as Error;
            notify();
        } finally {
            state.loadingEntity = false;
            notify();
        }
    };

    // ---- CRUD ----
    const createEntity = async (data: F) => {
        state.savingCreate = true;
        notify();
        try {
            const id = await createNet(data);
            await refresh();
            enterEdit(id);
            return id;
        } finally {
            state.savingCreate = false;
            notify();
        }
    };

    const updateEntity = async (id: Id, data: Partial<F>) => {
        state.savingUpdate = true;
        notify();
        try {
            await updateNet(id, data, { form: state.form });
            await refresh();
        } finally {
            state.savingUpdate = false;
            notify();
        }
    };

    const deleteById = async (id: Id) => {
        state.savingDelete = true;
        notify();
        try {
            await deleteNet(id);
            if (state.editingId === id) cancelEdit();
            await refresh();
        } finally {
            state.savingDelete = false;
            notify();
        }
    };

    // ---- snapshot ----
    const getState = (): ManagerState<E, F, Extras, Id> => state;

    return {
        getState,
        subscribe,
        get entities() {
            return state.entities;
        },
        get form() {
            return state.form;
        },
        get extras() {
            return state.extras;
        },
        get editingId() {
            return state.editingId;
        },
        get isEditing() {
            return state.isEditing;
        },
        get loadingList() {
            return state.loadingList;
        },
        get loadingEntity() {
            return state.loadingEntity;
        },
        get loadingExtras() {
            return state.loadingExtras;
        },
        get errorList() {
            return state.errorList;
        },
        get errorEntity() {
            return state.errorEntity;
        },
        get errorExtras() {
            return state.errorExtras;
        },
        get savingCreate() {
            return state.savingCreate;
        },
        get savingUpdate() {
            return state.savingUpdate;
        },
        get savingDelete() {
            return state.savingDelete;
        },
        get pageSize() {
            return state.pageSize;
        },
        get nextToken() {
            return state.nextToken;
        },
        get prevTokens() {
            return state.prevTokens;
        },
        get hasNext() {
            return state.hasNext;
        },
        get hasPrev() {
            return state.hasPrev;
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

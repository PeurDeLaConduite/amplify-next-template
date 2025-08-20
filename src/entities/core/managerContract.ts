// src/entities/core/managerContract.ts
export type MaybePromise<T> = T | Promise<T>;

export type ListParams = { limit?: number };
export type ListResult<E> = { items: E[]; nextToken?: string };

export interface ManagerState<E, F, Extras> {
    entities: E[];
    form: F;
    extras: Extras;

    // édition
    editingId: string | null;
    isEditing: boolean;

    // chargement/erreurs
    loadingList: boolean;
    loadingEntity: boolean;
    loadingExtras: boolean;
    errorList: unknown;
    errorEntity: unknown;
    errorExtras: unknown;

    // sauvegardes réseau
    savingCreate: boolean;
    savingUpdate: boolean;
    savingDelete: boolean;

    // pagination minimale (limit-only)
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ManagerContract<E, F, Id = string, Extras = Record<string, unknown>> {
    // ---- état (snapshot) ----
    getState(): ManagerState<E, F, Extras>;

    // ---- data pur ----
    listEntities(params?: ListParams): Promise<ListResult<E>>;
    getEntityById(id: Id): Promise<E | null>;

    // ---- cycle de vie ----
    refresh(): Promise<void>;
    refreshExtras(): Promise<void>;
    loadEntityById(id: Id): Promise<void>;

    // ---- CRUD (réseau) ----
    createEntity(data: F): Promise<Id>;
    updateEntity(id: Id, data: Partial<F>): Promise<void>;
    deleteById(id: Id): Promise<void>;

    // ---- form local ----
    getInitialForm(): F;
    updateField<K extends keyof F>(name: K, value: F[K]): void;
    patchForm(partial: Partial<F>): void;
    clearField<K extends keyof F>(name: K): void;
    clearForm(): void;
    enterEdit(id: Id | null): void;
    cancelEdit(): void;

    // ---- relations ----
    /**
     * N:N générique (diff add/remove ou replace)
     * `options.relation` est utile pour les modèles avec plusieurs N:N (ex: Post: 'tags' | 'sections').
     */
    syncManyToMany?(
        id: Id,
        link: { add?: Id[]; remove?: Id[]; replace?: Id[] },
        options?: { relation?: string }
    ): Promise<void>;

    // ---- validation (sync/async) ----
    validateField?<K extends keyof F>(
        name: K,
        value: F[K],
        ctx?: { form?: F; entities?: E[]; editingId?: Id; extras?: Extras }
    ): MaybePromise<string | null>;

    validateForm?(ctx?: {
        form?: F;
        entities?: E[];
        editingId?: Id;
        extras?: Extras;
    }): MaybePromise<{ valid: boolean; errors: Partial<Record<keyof F, string>> }>;
}

// src/entities/core/managerContract.ts
export type MaybePromise<T> = T | Promise<T>;

export type ListParams = { limit?: number; nextToken?: string };
export type ListResult<E> = { items: E[]; nextToken?: string };

export type ManagerState<E, F, Extras = Record<string, unknown>, Id = string> = {
    entities: E[];
    form: F;
    extras: Extras;
    editingId: Id | null;
    isEditing: boolean;
    loadingList: boolean;
    loadingEntity: boolean;
    loadingExtras: boolean;
    errorList: unknown;
    errorEntity: unknown;
    errorExtras: unknown;
    savingCreate: boolean;
    savingUpdate: boolean;
    savingDelete: boolean;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export interface ManagerContract<E, F, Id = string, Extras = Record<string, unknown>> {
    getState(): ManagerState<E, F, Extras, Id>;
    subscribe(listener: () => void): () => void;

    // --- états exposés ---
    readonly entities: E[];
    readonly form: F;
    readonly extras: Extras;

    readonly editingId: Id | null;
    readonly isEditing: boolean;

    // --- chargement / erreurs ---
    readonly loadingList: boolean;
    readonly loadingEntity: boolean;
    readonly loadingExtras: boolean;
    readonly errorList: Error | null;
    readonly errorEntity: Error | null;
    readonly errorExtras: Error | null;

    // --- sauvegardes réseau ---
    readonly savingCreate: boolean;
    readonly savingUpdate: boolean;
    readonly savingDelete: boolean;

    // --- pagination ---
    readonly pageSize: number;
    readonly nextToken: string | null;
    readonly prevTokens: (string | null)[];
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
    loadNextPage(): MaybePromise<void>;
    loadPrevPage(): MaybePromise<void>;

    // --- data pur ---
    listEntities(params?: ListParams): Promise<ListResult<E>>;
    getEntityById(id: Id): Promise<E | null>;

    // --- cycle de vie ---
    refresh(): Promise<void>;
    refreshExtras(): Promise<void>;
    loadEntityById(id: Id): Promise<void>;

    // --- CRUD ---
    createEntity(data: F): Promise<Id>;
    updateEntity(id: Id, data: Partial<F>): Promise<void>;
    deleteById(id: Id): Promise<void>;

    // --- form local ---
    getInitialForm(): F;
    updateField<K extends keyof F>(name: K, value: F[K]): void;
    patchForm(partial: Partial<F>): void;
    clearField<K extends keyof F>(name: K): void;
    clearForm(): void;
    enterEdit(id: Id | null): void;
    cancelEdit(): void;

    // ---- relations ----
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

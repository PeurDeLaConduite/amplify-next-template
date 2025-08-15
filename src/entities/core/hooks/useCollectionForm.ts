"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useModelForm, { type FormMode } from "./useModelForm2";

type Id = string;

export interface UseCollectionFormOptions<F, T, E = Record<string, unknown>> {
    /** Formulaire initial */
    initialForm: F;
    /** Conversion entité -> formulaire */
    toForm: (entity: T) => F;

    /** CRUD */
    create: (form: F) => Promise<string>;
    update: (id: Id, form: F) => Promise<string>;
    remove: (id: Id) => Promise<void>;

    /** Liste & id */
    list: () => Promise<T[]>;
    getId: (entity: T) => Id;

    /** Extras optionnels */
    initialExtras?: E;
    loadExtras?: () => Promise<Partial<E> | void> | Partial<E> | void;

    /** syncRelations (optionnel) */
    syncRelations?: (id: string, form: F) => Promise<void>;
}

/** Retourne un gestionnaire "collection + form" clé en main */
export function useCollectionForm<
    F extends Record<string, unknown>,
    T,
    E extends Record<string, unknown> = Record<string, unknown>,
>(opts: UseCollectionFormOptions<F, T, E>) {
    const {
        initialForm,
        toForm,
        create,
        update,
        remove,
        list,
        getId,
        initialExtras,
        loadExtras,
        syncRelations,
    } = opts;

    const [items, setItems] = useState<T[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const currentIdRef = useRef<Id | null>(null);

    const model = useModelForm<F, E>({
        initialForm,
        initialExtras: initialExtras as E | undefined,
        loadExtras,
        autoLoad: false, // la collection gère le chargement des items
        autoLoadExtras: true,
        create: async (form) => {
            const id = await create(form);
            await fetchItems();
            return id;
        },
        update: async (form) => {
            const id = currentIdRef.current;
            if (!id) throw new Error("Aucun élément sélectionné");
            const out = await update(id, form);
            await fetchItems();
            return out;
        },
        syncRelations,
    });

    const { setCreate, setEdit, adoptInitial, refreshExtras, submit, setMessage } = model;

    const fetchItems = useCallback(async () => {
        setLoadingItems(true);
        try {
            const data = await list();
            setItems(data);
        } finally {
            setLoadingItems(false);
        }
    }, [list]);

    useEffect(() => {
        void fetchItems();
    }, [fetchItems]);

    const editByIndex = useCallback(
        (idx: number) => {
            const entity = items[idx];
            if (!entity) return;
            currentIdRef.current = getId(entity);
            adoptInitial(toForm(entity), "edit");
        },
        [items, adoptInitial, getId, toForm]
    );

    const editById = useCallback(
        (id: Id) => {
            const entity = items.find((x) => getId(x) === id);
            if (!entity) return;
            currentIdRef.current = id;
            adoptInitial(toForm(entity), "edit");
        },
        [items, adoptInitial, getId, toForm]
    );

    const removeByIndex = useCallback(
        async (idx: number) => {
            const entity = items[idx];
            if (!entity) return;
            const id = getId(entity);
            await remove(id);
            if (currentIdRef.current === id) currentIdRef.current = null;
            await fetchItems();
            setMessage?.("Supprimé !");
        },
        [items, getId, remove, fetchItems, setMessage]
    );

    const startCreate = useCallback(() => {
        currentIdRef.current = null;
        setCreate(initialForm);
    }, [setCreate, initialForm]);

    const submitAndReset = useCallback(async () => {
        await submit();
        // Après create/update, on se remet en "create" vierge
        startCreate();
        await refreshExtras?.();
    }, [submit, startCreate, refreshExtras]);

    const state: FormMode = useMemo(
        () => (currentIdRef.current ? "edit" : model.mode),
        [currentIdRef, model.mode]
    );

    return {
        ...model,
        mode: state,
        items,
        loadingItems,
        currentId: currentIdRef.current,

        // actions
        fetchItems,
        setEdit,
        editByIndex,
        editById,
        removeByIndex,
        startCreate,
        submit: submitAndReset,
    };
}

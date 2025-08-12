// src/entities/core/hooks/useEntityManager.ts
"use client";
import { useEffect, useState, useCallback } from "react";

export type FieldKey<T> = keyof T & string;

export interface SingleFieldConfig<V> {
    parse: (input: unknown) => V;
    serialize: (value: V) => unknown;
    validate?: (value: V) => boolean;
    emptyValue: V;
}

export type FieldConfig<T> = { [K in FieldKey<T>]: SingleFieldConfig<T[K]> };

export interface UseEntityManagerOptions<T extends Record<string, unknown>> {
    fetch: () => Promise<(T & { id?: string }) | null>;
    create: (data: T) => Promise<void>;
    update: (entity: (T & { id?: string }) | null, data: Partial<T>) => Promise<void>;
    remove: (entity: (T & { id?: string }) | null) => Promise<void>;
    labels: (field: FieldKey<T>) => string;
    fields: FieldKey<T>[];
    initialData: T;
    config: FieldConfig<T>;
    preSave?: (data: T, entity: (T & { id?: string }) | null) => Promise<T | void>;
    postSave?: (data: T, entity: (T & { id?: string }) | null) => Promise<void>;
}

export interface EntityManagerResult<T extends Record<string, unknown>> {
    entity: (T & { id?: string }) | null;
    formData: T;
    setFormData: React.Dispatch<React.SetStateAction<T>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    editModeField: { field: FieldKey<T>; value: string } | null;
    setEditModeField: React.Dispatch<
        React.SetStateAction<{ field: FieldKey<T>; value: string } | null>
    >;
    handleChange: (field: FieldKey<T>, value: unknown) => void;
    save: () => Promise<void>;
    saveField: () => Promise<void>;
    clearField: (field: FieldKey<T>) => Promise<void>;
    deleteEntity: () => Promise<void>;
    labels: (field: FieldKey<T>) => string;
    fields: FieldKey<T>[];
    loading: boolean;
    fetchData: () => Promise<(T & { id?: string }) | null>;
}

export default function useEntityManager<T extends Record<string, unknown>>({
    fetch,
    create,
    update,
    remove,
    labels,
    fields,
    initialData,
    config,
    preSave,
    postSave,
}: UseEntityManagerOptions<T>): EntityManagerResult<T> {
    const [entity, setEntity] = useState<(T & { id?: string }) | null>(null);
    const [formData, setFormData] = useState<T>(initialData);
    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<{
        field: FieldKey<T>;
        value: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    // Fonction fetchData explicite
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetch();
            setEntity(data);
            if (data) {
                const next = { ...initialData } as T;
                fields.forEach((f) => {
                    const raw = (data as Record<string, unknown>)[f];
                    next[f] = config[f].parse(raw);
                });
                setFormData(next);
            }
            return data;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            setLoading(false);
            setEditMode(false);
        }
    }, [fetch, fields, initialData, config]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editMode]);

    // ...le reste inchangé
    const handleChange = (field: FieldKey<T>, value: unknown) => {
        const parsed = config[field].parse(value);
        if (config[field].validate && !config[field].validate(parsed)) return;
        setFormData((f) => ({ ...f, [field]: parsed }));
    };

    const save = async () => {
        setLoading(true);
        try {
            let serialized = { ...formData } as T;
            for (const f of fields) {
                const value = formData[f];
                if (config[f].validate && !config[f].validate(value)) {
                    return;
                }
                serialized[f] = config[f].serialize(value) as T[FieldKey<T>];
            }
            serialized = (await preSave?.(serialized, entity)) ?? serialized;
            if (entity) {
                await update(entity, serialized);
            } else {
                await create(serialized);
            }
            const updated = await fetchData();
            await postSave?.(serialized, updated);
        } finally {
            setLoading(false);
            setEditMode(false);
        }
    };

    const saveField = async () => {
        if (!editModeField) return;
        setLoading(true);
        try {
            const { field, value } = editModeField;
            const parsed = config[field].parse(value);
            if (config[field].validate && !config[field].validate(parsed)) return;
            const serialized = config[field].serialize(parsed);
            await update(entity, { [field]: serialized } as Partial<T>);
            setFormData((f) => ({ ...f, [field]: parsed }));
            setEditModeField(null);
        } finally {
            setLoading(false);
        }
    };

    const clearField = async (field: FieldKey<T>) => {
        setLoading(true);
        try {
            const empty = config[field].emptyValue;
            const serialized = config[field].serialize(empty);
            await update(entity, { [field]: serialized } as Partial<T>);
            setFormData((f) => ({ ...f, [field]: empty }));
        } finally {
            setLoading(false);
        }
    };

    const deleteEntity = async () => {
        setLoading(true);
        try {
            await remove(entity);
            setEntity(null);
            setFormData(initialData);
            setEditMode(false);
        } finally {
            setLoading(false);
        }
    };

    return {
        entity,
        formData,
        setFormData,
        editMode,
        setEditMode,
        editModeField,
        setEditModeField,
        handleChange,
        save,
        saveField,
        clearField,
        deleteEntity,
        labels,
        fields,
        loading,
        fetchData, // <-- expose la fonction si tu veux la déclencher à la main plus tard (ex: bouton refresh)
    };
}

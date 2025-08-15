"use client";

import { useCallback, useEffect, useState } from "react";
import type { FieldKey } from "./useModelForm";

export type FieldConfig<T extends Record<string, unknown>> = {
    [K in FieldKey<T>]: {
        parse: (v: unknown) => T[K];
        serialize: (v: T[K]) => unknown;
        emptyValue: T[K];
    };
};

export type UseEntityManagerConfig<T extends Record<string, unknown>> = {
    fetch: () => Promise<(T & { id?: string }) | null>;
    create: (data: T) => Promise<void>;
    update: (entity: (T & { id?: string }) | null, data: Partial<T>) => Promise<void>;
    remove: (entity: (T & { id?: string }) | null) => Promise<void>;
    labels: (field: FieldKey<T>) => string;
    fields: FieldKey<T>[];
    initialData: T;
    config: FieldConfig<T>;
};

export function useEntityManager<T extends Record<string, unknown>>(
    options: UseEntityManagerConfig<T>
) {
    const { fetch, create, update, remove, labels, fields, initialData, config } = options;
    const [entity, setEntity] = useState<(T & { id?: string }) | null>(null);
    const [formData, setFormData] = useState<T>(initialData);
    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<FieldKey<T> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch();
            if (res) {
                setEntity(res);
                const next = fields.reduce((acc, f) => {
                    const value = res[f];
                    const parser = config[f].parse;
                    acc[f] = parser(value) as T[typeof f];
                    return acc;
                }, {} as T);
                setFormData(next);
            } else {
                setEntity(null);
                setFormData(initialData);
            }
            return res;
        } finally {
            setLoading(false);
        }
    }, [fetch, fields, config, initialData]);

    useEffect(() => {
        void fetchData();
    }, [fetchData]);

    const handleChange = useCallback((field: FieldKey<T>, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value as T[typeof field] }));
    }, []);

    const save = useCallback(async () => {
        if (entity) {
            await update(entity, formData);
        } else {
            await create(formData);
        }
        await fetchData();
    }, [entity, formData, update, create, fetchData]);

    const saveField = useCallback(
        async (field: FieldKey<T>) => {
            if (!entity) return;
            const partial = { [field]: formData[field] } as Partial<T>;
            await update(entity, partial);
            await fetchData();
        },
        [entity, formData, update, fetchData]
    );

    const clearField = useCallback(
        (field: FieldKey<T>) => {
            setFormData((prev) => ({ ...prev, [field]: config[field].emptyValue }));
        },
        [config]
    );

    const deleteEntity = useCallback(async () => {
        if (!entity) return;
        await remove(entity);
        setEntity(null);
        setFormData(initialData);
    }, [entity, remove, initialData]);

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
        fetchData,
    } as const;
}

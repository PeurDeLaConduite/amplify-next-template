// src/entities/core/hooks/useModelForm.ts
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";

export type FieldKey<T> = keyof T & string;

export interface SingleFieldConfig<V> {
    parse: (input: unknown) => V;
    serialize: (value: V) => unknown;
    validate?: (value: V) => boolean;
    emptyValue: V;
}

export type FieldConfig<T> = { [K in FieldKey<T>]: SingleFieldConfig<T[K]> };

export type FormMode = "create" | "edit";

export interface UseModelFormOptions<
    F extends Record<string, unknown>,
    E extends Record<string, unknown> = Record<string, unknown>,
> {
    fetch?: () => Promise<(F & { id?: string }) | null>;
    create: (data: F) => Promise<string | void>;
    update: (entity: (F & { id?: string }) | null, data: Partial<F>) => Promise<void>;
    remove?: (entity: (F & { id?: string }) | null) => Promise<void>;
    initialForm: F;
    initialExtras?: E;
    mode?: FormMode;
    validate?: (form: F) => Promise<boolean> | boolean;
    fields: FieldKey<F>[];
    config: FieldConfig<F>;
    preSave?: (data: F, entity: (F & { id?: string }) | null) => Promise<F | void>;
    postSave?: (data: F, entity: (F & { id?: string }) | null) => Promise<void>;
    syncRelations?: (id: string, form: F) => Promise<void>;
}

export interface UseModelFormResult<F, E> {
    entity: (F & { id?: string }) | null;
    form: F;
    extras: E;
    mode: FormMode;
    dirty: boolean;
    saving: boolean;
    error: unknown;
    message: string | null;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    editModeField: { field: FieldKey<F>; value: string } | null;
    setEditModeField: React.Dispatch<
        React.SetStateAction<{ field: FieldKey<F>; value: string } | null>
    >;
    handleChange: (field: FieldKey<F>, value: unknown) => void;
    submit: () => Promise<void>;
    reset: () => void;
    setForm: React.Dispatch<React.SetStateAction<F>>;
    setExtras: React.Dispatch<React.SetStateAction<E>>;
    setMode: React.Dispatch<React.SetStateAction<FormMode>>;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
    startCreate: () => void;
    startEdit: (data: F) => void;
    cancelEdit: () => void;
    saveField: () => Promise<void>;
    clearField: (field: FieldKey<F>) => Promise<void>;
    fetchData: () => Promise<(F & { id?: string }) | null>;
    deleteEntity: () => Promise<void>;
}

function deepEqual(a: unknown, b: unknown) {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return false;
    }
}

export default function useModelForm<
    F extends Record<string, unknown>,
    E extends Record<string, unknown> = Record<string, unknown>,
>(options: UseModelFormOptions<F, E>): UseModelFormResult<F, E> {
    const {
        fetch,
        create,
        update,
        remove,
        initialForm,
        initialExtras,
        mode: initialMode = "create",
        validate,
        fields,
        config,
        preSave,
        postSave,
        syncRelations,
    } = options;

    const initialRef = useRef(initialForm);
    const [entity, setEntity] = useState<(F & { id?: string }) | null>(null);
    const [form, setForm] = useState<F>(initialForm);
    const [extras, setExtras] = useState<E>((initialExtras as E) ?? ({} as E));
    const [mode, setMode] = useState<FormMode>(initialMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editModeField, setEditModeField] = useState<{
        field: FieldKey<F>;
        value: string;
    } | null>(null);

    const dirty = useMemo(() => !deepEqual(form, initialRef.current), [form]);

    const handleChange = useCallback(
        (field: FieldKey<F>, value: unknown) => {
            const parsed = config[field].parse(value);
            if (config[field].validate && !config[field].validate(parsed)) return;
            setForm((f) => ({ ...f, [field]: parsed }));
        },
        [config]
    );

    const fetchData = useCallback(async () => {
        if (!fetch) return null;
        try {
            const data = await fetch();
            setEntity(data);
            if (data) {
                const next = { ...initialForm } as F;
                fields.forEach((f) => {
                    const raw = (data as Record<string, unknown>)[f];
                    next[f] = config[f].parse(raw);
                });
                setForm(next);
                initialRef.current = next;
                setMode("edit");
            } else {
                setForm(initialForm);
                setMode("create");
                initialRef.current = initialForm;
            }
            return data;
        } catch (e) {
            setError(e);
            return null;
        } finally {
            setEditMode(false);
        }
    }, [fetch, fields, config, initialForm]);

    useEffect(() => {
        if (fetch) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reset = useCallback(() => {
        setForm(initialRef.current);
        setMode(initialMode);
        setError(null);
        setEditMode(false);
    }, [initialMode]);

    const startCreate = useCallback(() => {
        setEntity(null);
        setForm(initialForm);
        setMode("create");
        setError(null);
        setEditMode(true);
        initialRef.current = initialForm;
    }, [initialForm]);

    const startEdit = useCallback((data: F) => {
        setForm(data);
        setMode("edit");
        setError(null);
        setEditMode(true);
        initialRef.current = data;
    }, []);

    const cancelEdit = useCallback(() => {
        setForm(initialRef.current);
        setEditMode(false);
        setError(null);
    }, []);

    const submit = useCallback(async () => {
        setSaving(true);
        setError(null);
        try {
            if (validate) {
                const valid = await validate(form);
                if (!valid) {
                    setSaving(false);
                    return;
                }
            }
            let serialized = { ...form } as F;
            for (const f of fields) {
                const value = form[f];
                if (config[f].validate && !config[f].validate(value)) {
                    setSaving(false);
                    return;
                }
                serialized[f] = config[f].serialize(value) as F[FieldKey<F>];
            }
            serialized = (await preSave?.(serialized, entity)) ?? serialized;
            const id =
                mode === "create"
                    ? await create(serialized)
                    : (await update(entity, serialized), entity?.id ?? "");
            if (syncRelations && typeof id === "string" && id) {
                await syncRelations(id, serialized);
            }
            const updated = await fetchData();
            await postSave?.(serialized, updated);
            initialRef.current = form;
            setEditMode(false);
            setMessage("Saved");
            setMode("edit");
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }, [
        form,
        validate,
        fields,
        config,
        preSave,
        entity,
        mode,
        create,
        update,
        syncRelations,
        fetchData,
        postSave,
    ]);

    const saveField = useCallback(async () => {
        if (!editModeField) return;
        setSaving(true);
        try {
            const { field, value } = editModeField;
            const parsed = config[field].parse(value);
            if (config[field].validate && !config[field].validate(parsed)) return;
            const serialized = config[field].serialize(parsed);
            await update(entity, { [field]: serialized } as Partial<F>);
            setForm((f) => ({ ...f, [field]: parsed }));
            setEditModeField(null);
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }, [editModeField, config, update, entity]);

    const clearField = useCallback(
        async (field: FieldKey<F>) => {
            setSaving(true);
            try {
                const empty = config[field].emptyValue;
                const serialized = config[field].serialize(empty);
                await update(entity, { [field]: serialized } as Partial<F>);
                setForm((f) => ({ ...f, [field]: empty }));
            } catch (e) {
                setError(e);
            } finally {
                setSaving(false);
            }
        },
        [config, update, entity]
    );

    const deleteEntity = useCallback(async () => {
        if (!remove) return;
        setSaving(true);
        try {
            await remove(entity);
            setEntity(null);
            setForm(initialForm);
            setMode("create");
            setEditMode(false);
            initialRef.current = initialForm;
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }, [remove, entity, initialForm]);

    return {
        entity,
        form,
        extras,
        mode,
        dirty,
        saving,
        error,
        message,
        editMode,
        setEditMode,
        editModeField,
        setEditModeField,
        handleChange,
        submit,
        reset,
        setForm,
        setExtras,
        setMode,
        setMessage,
        startCreate,
        startEdit,
        cancelEdit,
        saveField,
        clearField,
        fetchData,
        deleteEntity,
    };
}

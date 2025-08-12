// src/entities/core/hooks/useEntityFormManager.ts
"use client";
import { useCallback, useMemo, useRef, useState } from "react";
import type React from "react";

export type FormMode = "create" | "edit";

export interface UseEntityFormManagerOptions<F, E = Record<string, unknown>> {
    initialForm: F;
    initialExtras?: E;
    mode?: FormMode;
    validate?: (form: F) => Promise<boolean> | boolean;
    create: (form: F) => Promise<string>;
    update: (form: F) => Promise<string>;
    syncRelations?: (id: string, form: F) => Promise<void>;
}

export interface UseEntityFormManagerResult<F, E> {
    form: F;
    extras: E;
    mode: FormMode;
    dirty: boolean;
    saving: boolean;
    error: unknown;
    message: string | null;
    handleChange: <K extends keyof F>(field: K, value: F[K]) => void;
    submit: () => Promise<void>;
    reset: () => void;
    setForm: React.Dispatch<React.SetStateAction<F>>;
    setExtras: React.Dispatch<React.SetStateAction<E>>;
    setMode: React.Dispatch<React.SetStateAction<FormMode>>;
    setMessage: React.Dispatch<React.SetStateAction<string | null>>;
    startCreate: () => void;
    startEdit: (data: F) => void;
    cancelEdit: () => void;
}

function deepEqual(a: unknown, b: unknown) {
    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch {
        return false;
    }
}

export default function useEntityFormManager<
    F extends Record<string, unknown>,
    E extends Record<string, unknown> = Record<string, unknown>,
>(options: UseEntityFormManagerOptions<F, E>): UseEntityFormManagerResult<F, E> {
    const {
        initialForm,
        initialExtras,
        mode: initialMode = "create",
        validate,
        create,
        update,
        syncRelations,
    } = options;

    const initialRef = useRef(initialForm);
    const [form, setForm] = useState<F>(initialForm);
    const [extras, setExtras] = useState<E>((initialExtras as E) ?? ({} as E));
    const [mode, setMode] = useState<FormMode>(initialMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<unknown>(null);
    const [message, setMessage] = useState<string | null>(null);

    const dirty = useMemo(() => !deepEqual(form, initialRef.current), [form]);

    const handleChange = useCallback(<K extends keyof F>(field: K, value: F[K]) => {
        setForm((f) => ({ ...f, [field]: value }));
    }, []);

    const reset = useCallback(() => {
        setForm(initialRef.current);
        setMode(initialMode);
        setError(null);
    }, [initialMode]);

    const startCreate = useCallback(() => {
        setForm(initialForm);
        setMode("create");
        setError(null);
        initialRef.current = initialForm;
    }, [initialForm]);

    const startEdit = useCallback((data: F) => {
        setForm(data);
        setMode("edit");
        setError(null);
        initialRef.current = data;
    }, []);

    const cancelEdit = useCallback(() => {
        setForm(initialForm);
        setMode("create");
        setError(null);
        initialRef.current = initialForm;
    }, [initialForm]);

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
            const id = mode === "create" ? await create(form) : await update(form);
            if (syncRelations) {
                await syncRelations(id, form);
            }
            setMode("edit");
            initialRef.current = form;
        } catch (e) {
            setError(e);
        } finally {
            setSaving(false);
        }
    }, [form, mode, validate, create, update, syncRelations]);

    return {
        form,
        extras,
        mode,
        dirty,
        saving,
        error,
        message,
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
    };
}

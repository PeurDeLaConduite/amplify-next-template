// src/components/blog/manage/EntityFormShell.tsx
"use client";

import React, { forwardRef, type FormEvent } from "react";

export interface EntityFormManager<F> {
    form: F;
    submit: () => Promise<void>;
    setForm: React.Dispatch<React.SetStateAction<F>>;
    setMode: React.Dispatch<React.SetStateAction<"create" | "edit">>;
    mode: "create" | "edit";
    saving?: boolean;
    message?: string | null;
}

interface Props<F> {
    manager: EntityFormManager<F>;
    initialForm: F;
    onSave: () => void;
    children: React.ReactNode; // <- tes champs contrôlés
    submitLabel?: { create: string; edit: string };
    className?: string;
}

const EntityFormShell = forwardRef<HTMLFormElement, Props<any>>(function EntityFormShell(
    {
        manager,
        initialForm,
        onSave,
        children,
        className,
        submitLabel = { create: "Créer", edit: "Mettre à jour" },
    },
    ref
) {
    const { submit, setForm, setMode, mode, saving, message } = manager;

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await submit();
        setMode("create");
        setForm(initialForm);
        onSave();
    }

    return (
        <div className="mb-6">
            <form ref={ref} onSubmit={handleSubmit} className={`grid gap-2 ${className ?? ""}`}>
                {children}
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={!!saving}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {mode === "edit" ? submitLabel.edit : submitLabel.create}
                    </button>
                </div>
            </form>
            {message && (
                <p
                    className={`mt-2 text-sm ${message.startsWith("Erreur") ? "text-red-600" : "text-green-600"}`}
                >
                    {message}
                </p>
            )}
        </div>
    );
});

export default EntityFormShell;

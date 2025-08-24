// src/components/blog/manage/BlogFormShell.tsx
"use client";

import React, { forwardRef, type FormEvent, type Ref } from "react";
import { EditButton, UpdateButton, CancelButton } from "@components/ui/Button";
import type { JSX } from "react";

export interface BlogFormManager<F> {
    form: F;
    submit: () => Promise<boolean>;
    setForm: React.Dispatch<React.SetStateAction<F>>;
    setMode: React.Dispatch<React.SetStateAction<"create" | "edit">>;
    mode: "create" | "edit";
    saving?: boolean;
    message?: string | null;
}

interface Props<F> {
    blogFormManager: BlogFormManager<F>;
    initialForm: F;
    onSaveSuccess: () => void;
    children: React.ReactNode; // <- tes champs contrôlés
    submitLabel?: { create: string; edit: string };
    className?: string;
    onCancel: () => void;
}

const BlogFormShellInner = <F,>(
    {
        blogFormManager,
        initialForm,
        onCancel,
        onSaveSuccess,
        children,
        className,
        submitLabel = { create: "Créer", edit: "Mettre à jour" },
    }: Props<F>,
    ref: React.ForwardedRef<HTMLFormElement>
) => {
    const { submit, setForm, setMode, mode, saving, message } = blogFormManager;

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const ok = await submit();
        if (!ok) return; // si validation échouée ou erreur, on ne reset pas

        // succès : on peut réinitialiser si mode "create"
        if (mode === "create") {
            setMode("create");
            setForm(initialForm);
        }
        onSaveSuccess();
    }

    return (
        <div className="mb-6">
            <form ref={ref} onSubmit={handleSubmit} className={`grid gap-2 ${className ?? ""}`}>
                {children}
                <div className="flex space-x-2">
                    <button
                        type="submit"
                        disabled={saving} // désactivé pendant la sauvegarde
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        {mode === "edit" ? submitLabel.edit : submitLabel.create}
                    </button>

                    <CancelButton onCancel={onCancel} label="Annuler" size="small" />
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
};

export default forwardRef(BlogFormShellInner) as <F>(
    props: Props<F> & { ref?: Ref<HTMLFormElement> }
) => JSX.Element;

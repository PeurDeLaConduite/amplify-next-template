"use client";

import React, { forwardRef, type ChangeEvent, type FormEvent } from "react";
import EditableField from "@components/forms/EditableField";
import EditableTextArea from "@components/forms/EditableTextArea";
import { type AuthorFormType, initialAuthorForm, useAuthorForm } from "@entities/models/author";

interface Props {
    manager: ReturnType<typeof useAuthorForm>;
    onSave: () => void;
}

const AuthorForm = forwardRef<HTMLFormElement, Props>(function AuthorForm(
    { manager, onSave },
    ref
) {
    const { form, submit, handleChange, setForm, setMode, mode, saving, message } = manager;

    function handleFieldChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        handleChange(name as keyof AuthorFormType, value as never);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await submit();
        setMode("create");
        setForm(initialAuthorForm);
        onSave();
    }

    return (
        <div className="mb-6">
            <form ref={ref} onSubmit={handleSubmit} className="grid gap-2">
                <EditableField
                    name="authorName"
                    label="Nom"
                    value={form.authorName ?? ""}
                    onChange={handleFieldChange}
                    readOnly={false}
                />
                <EditableField
                    name="avatar"
                    label="URL de l'avatar"
                    value={form.avatar ?? ""}
                    onChange={handleFieldChange}
                    readOnly={false}
                />
                <EditableTextArea
                    name="bio"
                    label="Bio"
                    value={form.bio ?? ""}
                    onChange={handleFieldChange}
                    readOnly={false}
                />
                <EditableField
                    name="email"
                    label="Email"
                    value={form.email ?? ""}
                    onChange={handleFieldChange}
                    readOnly={false}
                />
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                    {mode === "edit" ? "Mettre à jour" : "Ajouter un auteur"}
                </button>
            </form>
            {message && (
                <p
                    className={`mt-2 text-sm ${
                        message.startsWith("Erreur") ? "text-red-600" : "text-green-600"
                    }`}
                >
                    {message}
                </p>
            )}
        </div>
    );
});

export default AuthorForm;

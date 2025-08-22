// src/components/Blog/manage/authors/AuthorForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent } from "react";
import BlogFormShell from "@components/Blog/manage/BlogFormShell";
import { EditableField, EditableTextArea } from "@components/ui/Form";
import { type AuthorFormType, initialAuthorForm, useAuthorForm } from "@entities/models/author";

interface Props {
    manager: ReturnType<typeof useAuthorForm>;
    onUpdate: () => void;
}

const AuthorForm = forwardRef<HTMLFormElement, Props>(function AuthorForm(
    { manager, onUpdate },
    ref
) {
    const { form, handleChange } = manager;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        handleChange(name as keyof AuthorFormType, value as never);
    };

    return (
        <BlogFormShell
            ref={ref}
            manager={manager}
            initialForm={initialAuthorForm}
            onUpdate={onUpdate}
            submitLabel={{ create: "Ajouter un auteur", edit: "Mettre à jour" }}
        >
            <EditableField
                name="authorName"
                label="Nom"
                value={form.authorName ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableField
                name="avatar"
                label="URL de l'avatar"
                value={form.avatar ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableTextArea
                name="bio"
                label="Bio"
                value={form.bio ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableField
                name="email"
                label="Email"
                value={form.email ?? ""}
                onChange={onChange}
                readOnly={false}
            />
        </BlogFormShell>
    );
});

export default AuthorForm;

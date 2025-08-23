// src/components/Blog/manage/authors/AuthorForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent } from "react";
import BlogFormShell from "@components/Blog/manage/BlogFormShell";
import { EditableField, EditableTextArea } from "@components/ui/Form";
import { type AuthorFormType, initialAuthorForm, useAuthorForm } from "@entities/models/author";

interface Props {
    authorFormManager: ReturnType<typeof useAuthorForm>;
    onSaveSuccess: () => void;
}

const AuthorForm = forwardRef<HTMLFormElement, Props>(function AuthorForm(
    { authorFormManager, onSaveSuccess },
    ref
) {
    const { form, setFieldValue } = authorFormManager;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFieldValue(name as keyof AuthorFormType, value as never);
    };

    return (
        <BlogFormShell
            ref={ref}
            blogFormManager={authorFormManager}
            initialForm={initialAuthorForm}
            onSaveSuccess={onSaveSuccess}
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

// src/components/Blog/manage/authors/AuthorForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent } from "react";
import BlogFormShell from "@components/Blog/manage/BlogFormShell";
import { EditableField, EditableTextArea, OrderSelector } from "@components/ui/Form";
import { type AuthorFormType, initialAuthorForm, useAuthorForm } from "@entities/models/author";
import type { AuthorType } from "@entities/models/author/types";

interface Props {
    authorFormManager: ReturnType<typeof useAuthorForm>;
    onSaveSuccess: () => void;
    onCancel: () => void;
    authors: AuthorType[]; // 👈 comme PostForm (posts)
    editingId: string | null; // 👈 comme PostForm (editingId)
}

const AuthorForm = forwardRef<HTMLFormElement, Props>(function AuthorForm(
    { authorFormManager, onSaveSuccess, onCancel, authors, editingId },
    ref
) {
    const { form, setFieldValue } = authorFormManager;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFieldValue(name as keyof AuthorFormType, value as never);
    };

    return (
        <BlogFormShell<AuthorFormType>
            ref={ref}
            blogFormManager={authorFormManager}
            initialForm={initialAuthorForm}
            onSaveSuccess={onSaveSuccess}
            onCancel={onCancel}
            submitLabel={{ create: "Ajouter un auteur", edit: "Mettre à jour" }}
        >
            <EditableField
                name="authorName"
                label="Nom"
                value={form.authorName ?? ""}
                onChange={onChange}
                readOnly={false}
                autoComplete="name"
            />

            <EditableField
                name="avatar"
                label="URL de l'avatar"
                value={form.avatar ?? ""}
                onChange={onChange}
                readOnly={false}
                type="url"
                autoComplete="url"
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
                type="email"
                autoComplete="email"
            />

            {/* Aligne avec PostForm → contrôle d'ordre */}
            <OrderSelector
                items={authors}
                editingId={editingId}
                value={form.order ?? 1}
                onReorder={(_, newOrder) => setFieldValue("order", newOrder)}
            />
        </BlogFormShell>
    );
});

export default AuthorForm;

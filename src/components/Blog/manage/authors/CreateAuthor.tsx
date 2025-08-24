"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import RequireAdmin from "@components/RequireAdmin";
import AuthorForm from "@components/Blog/manage/authors/AuthorForm";
import AuthorList from "@components/Blog/manage/authors/AuthorList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { type AuthorType, useAuthorForm } from "@entities/models/author";

type IdLike = string | number;

export default function AuthorManagerPage() {
    const [authorToEdit, setAuthorToEdit] = useState<AuthorType | null>(null);
    const authorId = authorToEdit?.id ?? null;
    const formRef = useRef<HTMLFormElement>(null);

    const manager = useAuthorForm(authorToEdit);
    const {
        extras: { authors, loading },
        listAuthors,
        selectById,
        deleteEntity,
        exitEditMode,
    } = manager;

    useEffect(() => {
        listAuthors();
    }, [listAuthors]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const author = selectById(String(id));
            if (author) setAuthorToEdit(author);
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await deleteEntity(String(id));
        },
        [deleteEntity]
    );

    const handleSaved = useCallback(async () => {
        await listAuthors();
        setAuthorToEdit(null); // pas d'authorId à nettoyer
    }, [listAuthors]);

    const handleCancel = useCallback(() => {
        exitEditMode();
        setAuthorToEdit(null);
    }, [exitEditMode]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Éditeur de blog : Auteurs">
                <SectionHeader className="mt-8">Nouvel auteur</SectionHeader>
                <AuthorForm
                    ref={formRef}
                    authorFormManager={manager}
                    authors={authors}
                    editingId={authorId}
                    onSaveSuccess={handleSaved}
                    onCancel={handleCancel}
                />

                <SectionHeader loading={loading}>Liste d&apos;auteurs</SectionHeader>
                <AuthorList
                    authors={authors}
                    authorId={authorId} // derive de l’objet courant
                    onEditById={handleEditById}
                    onUpdate={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

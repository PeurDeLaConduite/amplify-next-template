"use client";

import React, { useRef, useCallback } from "react";
import RequireAdmin from "@components/RequireAdmin";
import AuthorForm from "@components/Blog/manage/authors/AuthorForm";
import AuthorList from "@components/Blog/manage/authors/AuthorList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { initialAuthorForm, useAuthorManager } from "@entities/models/author";

type IdLike = string | number;

export default function AuthorManagerPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useAuthorManager();
    const {
        entities: authors,
        loadingList,
        editingId,
        loadEntityById,
        deleteById,
        cancelEdit,
        patchForm,
    } = manager;

    const handleEditById = useCallback(
        (id: IdLike) => {
            void loadEntityById(String(id));
        },
        [loadEntityById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await deleteById(String(id));
        },
        [deleteById]
    );

    const handleSave = useCallback(() => {
        // la liste est rafraîchie automatiquement par le manager
    }, []);

    const handleRequestSubmit = useCallback(() => {
        formRef.current?.requestSubmit();
    }, []);

    const handleCancel = useCallback(() => {
        cancelEdit();
        patchForm(initialAuthorForm);
    }, [cancelEdit, patchForm]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Éditeur de blog : Auteurs">
                <SectionHeader className="mt-8">Nouvel auteur</SectionHeader>
                <AuthorForm ref={formRef} manager={manager} onSave={handleSave} />
                <SectionHeader loading={loadingList}>Liste d&apos;auteurs</SectionHeader>
                <AuthorList
                    authors={authors}
                    editingId={editingId}
                    onEditById={handleEditById}
                    onSave={handleRequestSubmit}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

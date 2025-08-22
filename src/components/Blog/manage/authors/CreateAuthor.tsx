"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import RequireAdmin from "@components/RequireAdmin";
import AuthorForm from "@components/Blog/manage/authors/AuthorForm";
import AuthorList from "@components/Blog/manage/authors/AuthorList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { type AuthorType, initialAuthorForm, useAuthorForm } from "@entities/models/author";

type IdLike = string | number;

export default function AuthorManagerPage() {
    const [editingAuthor, setEditingAuthor] = useState<AuthorType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useAuthorForm(editingAuthor);
    const {
        extras: { authors, loading },
        fetchAuthors,
        selectById,
        removeById,
        setForm,
        setMode,
    } = manager;

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const author = selectById(String(id));
            if (!author) return;
            setEditingAuthor(author);
            setEditingId(String(id));
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
        },
        [removeById]
    );

    const handleSave = useCallback(async () => {
        await fetchAuthors();
        setEditingAuthor(null);
        setEditingId(null);
    }, [fetchAuthors]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Éditeur de blog : Auteurs">
                <SectionHeader className="mt-8">Nouvel auteur</SectionHeader>
                <AuthorForm ref={formRef} manager={manager} onSave={handleSave} />
                <SectionHeader loading={loading}>Liste d&apos;auteurs</SectionHeader>
                <AuthorList
                    authors={authors}
                    editingId={editingId}
                    onEditById={handleEditById}
                    onUpdate={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={() => {
                        setEditingAuthor(null);
                        setEditingId(null);
                        setMode("create");
                        setForm(initialAuthorForm);
                    }}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

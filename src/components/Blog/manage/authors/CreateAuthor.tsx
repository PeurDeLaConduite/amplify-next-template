"use client";

import React, { useEffect, useRef, useState } from "react";
import RequireAdmin from "@components/RequireAdmin";
import AuthorForm from "@components/Blog/manage/authors/AuthorForm";
import AuthorList from "@components/Blog/manage/authors/AuthorList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import {
    type AuthorType,
    initialAuthorForm,
    useAuthorForm,
    authorService,
} from "@entities/models/author";

export default function AuthorManagerPage() {
    const [editingAuthor, setEditingAuthor] = useState<AuthorType | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useAuthorForm(editingAuthor);
    const {
        extras: { authors, loading },
        fetchAuthors,
        setForm,
        setMode,
    } = manager;

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    const handleEdit = (idx: number) => {
        setEditingAuthor(authors[idx]);
        setEditingIndex(idx);
    };

    const handleDelete = async (idx: number) => {
        if (!confirm("Supprimer cet auteur ?")) return;
        const id = authors[idx].id;
        await authorService.delete({ id });
        await fetchAuthors();
    };

    const handleSave = async () => {
        await fetchAuthors();
        setEditingAuthor(null);
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingAuthor(null);
        setEditingIndex(null);
        setMode("create");
        setForm(initialAuthorForm);
    };

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Éditeur de blog : Auteurs">
                <AuthorForm ref={formRef} manager={manager} onSave={handleSave} />
                <AuthorList
                    authors={authors}
                    editingIndex={editingIndex}
                    loading={loading}
                    onEdit={handleEdit}
                    onSave={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

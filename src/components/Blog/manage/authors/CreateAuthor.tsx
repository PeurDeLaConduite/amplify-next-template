"use client";

import React, { useEffect, useRef, useState } from "react";
import RequireAdmin from "@components/RequireAdmin";
import AuthorForm from "@components/Blog/manage/authors/AuthorForm";
import AuthorList from "@components/Blog/manage/authors/AuthorList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import {
    type AuthorType,
    initialAuthorForm,
    useAuthorForm,
    authorService,
} from "@entities/models/author";

export default function AuthorManagerPage() {
    const [editingAuthor, setEditingAuthor] = useState<AuthorType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
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

    const handleEditById = (id: string) => {
        const author = authors.find((a) => a.id === id);
        if (!author) return;
        setEditingAuthor(author);
        setEditingId(id);
    };

    const handleDeleteById = async (id: string) => {
        if (!confirm("Supprimer cet auteur ?")) return;
        await authorService.delete({ id });
        await fetchAuthors();
    };

    const handleSave = async () => {
        await fetchAuthors();
        setEditingAuthor(null);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingAuthor(null);
        setEditingId(null);
        setMode("create");
        setForm(initialAuthorForm);
    };

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
                    onSave={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

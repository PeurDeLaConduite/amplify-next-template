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
    const [authorToEdit, setAuthorToEdit] = useState<AuthorType | null>(null);
    const [authorId, setAuthorId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useAuthorForm(authorToEdit);
    const {
        extras: { authors, loading },
        listAuthors,
        selectById,
        removeById,
        setForm,
        setMode,
    } = manager;

    useEffect(() => {
        listAuthors();
    }, [listAuthors]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const author = selectById(String(id));
            if (!author) return;
            setAuthorToEdit(author);
            setAuthorId(String(id));
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
        },
        [removeById]
    );

    const handleUpdate = useCallback(async () => {
        await listAuthors();
        setAuthorToEdit(null);
        setAuthorId(null);
    }, [listAuthors]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Éditeur de blog : Auteurs">
                <SectionHeader className="mt-8">Nouvel auteur</SectionHeader>
                <AuthorForm
                    ref={formRef}
                    authorFormManager={manager}
                    onSaveSuccess={handleUpdate}
                />
                <SectionHeader loading={loading}>Liste d&apos;auteurs</SectionHeader>
                <AuthorList
                    authors={authors}
                    authorId={authorId}
                    onEditById={handleEditById}
                    onUpdate={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={() => {
                        setAuthorToEdit(null);
                        setAuthorId(null);
                        setMode("create");
                        setForm(initialAuthorForm);
                    }}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

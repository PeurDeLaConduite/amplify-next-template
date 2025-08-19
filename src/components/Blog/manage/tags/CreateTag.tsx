// src/components/Blog/manage/tags/CreateTag.tsx
"use client";

import React, { useEffect, useRef, useCallback } from "react";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { RefreshButton } from "@components/buttons";

import TagForm from "@components/Blog/manage/tags/TagForm";
import TagList from "@components/Blog/manage/tags/TagList";
import PostTagsRelationManager from "@components/Blog/manage/tags/PostTagsRelationManager";

import { useTagForm, type UseTagFormReturn } from "@entities/models/tag/hooks";

export default function CreateTagPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const manager: UseTagFormReturn = useTagForm();

    const {
        extras: { tags, posts, index },
        loading,
        fetchAll,
        edit,
        cancel,
        remove,
        tagsForPost,
        isTagLinked,
        toggle,
    } = manager;

    useEffect(() => {
        void fetchAll?.();
    }, [fetchAll]);

    // ⇧ stable: évite de casser la mémo de TagList
    const submitForm = useCallback(() => formRef.current?.requestSubmit(), []);

    const handleSaved = useCallback(async () => {
        await fetchAll?.();
    }, [fetchAll]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Tags">
                <div className="flex items-center gap-2">
                    <SectionHeader className="!mb-0 flex-1">Nouveau tag</SectionHeader>
                    <RefreshButton onClick={fetchAll} label="Rafraîchir" />
                </div>

                <TagForm ref={formRef} manager={manager} onSave={handleSaved} />

                <SectionHeader>Liste des tags</SectionHeader>
                <TagList
                    tags={tags}
                    editingIndex={index ?? null}
                    onEdit={edit}
                    onSave={submitForm}
                    onCancel={cancel}
                    onDelete={remove}
                />

                <SectionHeader loading={loading}>Associer les tags aux articles</SectionHeader>
                <PostTagsRelationManager
                    posts={posts}
                    tags={tags}
                    tagsForPost={tagsForPost}
                    isTagLinked={isTagLinked}
                    toggle={toggle}
                    loading={!!loading}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

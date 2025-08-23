// src/components/Blog/manage/tags/CreateTag.tsx
"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { RefreshButton } from "@components/ui/Button";

import TagForm from "@components/Blog/manage/tags/TagForm";
import TagList from "@components/Blog/manage/tags/TagList";
import PostTagsRelationManager from "@components/Blog/manage/tags/PostTagsRelationManager";

import { useTagForm, type UseTagFormReturn } from "@entities/models/tag/hooks";

type IdLike = string | number;

export default function CreateTagPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const manager: UseTagFormReturn = useTagForm();
    const [editingId, setEditingId] = useState<string | null>(null);

    const {
        extras: { tags, posts },
        loading,
        listTags,
        selectById,
        cancel,
        removeById,
        tagsForPost,
        isTagLinked,
        toggle,
    } = manager;

    useEffect(() => {
        void listTags();
    }, [listTags]);

    // ⇧ stable: évite de casser la mémo de TagList
    const submitForm = useCallback(() => formRef.current?.requestSubmit(), []);

    const handleUpdated = useCallback(async () => {
        await listTags();
        setEditingId(null);
    }, [listTags]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            void selectById(String(id));
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

    const handleCancel = useCallback(() => {
        cancel();
        setEditingId(null);
    }, [cancel]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Tags">
                <div className="flex items-center gap-2">
                    <SectionHeader className="!mb-0 flex-1">Nouveau tag</SectionHeader>
                    <RefreshButton onRefresh={listTags} label="Rafraîchir" size="small" />
                </div>

                <TagForm ref={formRef} manager={manager} dispatchEvent={handleUpdated} />

                <SectionHeader>Liste des tags</SectionHeader>
                <TagList
                    tags={tags}
                    editingId={editingId}
                    onEditById={handleEditById}
                    onUpdate={submitForm}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                    editButtonLabel={""}
                    deleteButtonLabel={""}
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

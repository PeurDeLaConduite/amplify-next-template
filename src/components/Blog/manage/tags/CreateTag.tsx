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

import { type TagType, useTagForm } from "@entities/models/tag/";

type IdLike = string | number;

export default function CreateTagPage() {
    const [tagToEdit, setTagToEdit] = useState<TagType | null>(null);
    const tagId = tagToEdit?.id ?? null;
    const formRef = useRef<HTMLFormElement>(null);

    const manager = useTagForm(tagToEdit);
    const {
        extras: { tags, posts },
        loading,
        listTags,
        selectById,
        deleteEntity,
        tagsForPost,
        isTagLinked,
        toggle,
    } = manager;

    useEffect(() => {
        void listTags();
    }, [listTags]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const tag = selectById(String(id)); // set déjà l’ID dans le hook + mode "edit"
            if (tag) setTagToEdit(tag);
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
        await listTags();
        setTagToEdit(null);
    }, [listTags]);

    const handleCancel = useCallback(() => {
        setTagToEdit(null);
    }, []);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Tags">
                <div className="flex items-center gap-2">
                    <SectionHeader className="!mb-0 flex-1">Nouveau tag</SectionHeader>
                    <RefreshButton onRefresh={listTags} label="Rafraîchir" size="small" />
                </div>

                <TagForm
                    ref={formRef}
                    tagFormManager={manager}
                    tags={tags}
                    editingId={tagId}
                    onSaveSuccess={handleSaved}
                />

                <SectionHeader>Liste des tags</SectionHeader>
                <TagList
                    tags={tags}
                    tagId={tagId}
                    onEditById={handleEditById}
                    onUpdate={() => formRef.current?.requestSubmit()}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                    editButtonLabel=""
                    deleteButtonLabel=""
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

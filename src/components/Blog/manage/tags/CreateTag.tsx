// src/components/Blog/manage/tags/CreateTag.tsx
"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { RefreshButton } from "@components/buttons";

import TagForm from "@components/Blog/manage/tags/TagForm";
import TagList from "@components/Blog/manage/tags/TagList";
import PostTagsRelationManager from "@components/Blog/manage/tags/PostTagsRelationManager";

import { useTagManager } from "@entities/models/tag";
import { postTagService } from "@entities/relations/postTag/service";

type IdLike = string | number;

export default function CreateTagPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useTagManager();
    const { state, refresh, refreshExtras, loadEntityById, cancelEdit, deleteById } = manager;
    const {
        entities: tags,
        extras: { posts = [] },
        editingId,
        loadingList,
        loadingExtras,
    } = state;
    const loading = loadingList || loadingExtras;

    const [postTags, setPostTags] = useState<{ postId: string; tagId: string }[]>([]);

    const fetchAll = useCallback(async () => {
        await Promise.all([refresh(), refreshExtras()]);
        const { data } = await postTagService.list({ limit: 999 });
        setPostTags(data ?? []);
    }, [refresh, refreshExtras]);

    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);

    const submitForm = useCallback(() => formRef.current?.requestSubmit(), []);

    const handleSaved = useCallback(async () => {
        await fetchAll();
    }, [fetchAll]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            void loadEntityById(String(id));
        },
        [loadEntityById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await deleteById(String(id));
            await fetchAll();
        },
        [deleteById, fetchAll]
    );

    const handleCancel = useCallback(() => {
        cancelEdit();
    }, [cancelEdit]);

    const tagsForPost = useCallback(
        (postId: string) => {
            const ids = postTags.filter((pt) => pt.postId === postId).map((pt) => pt.tagId);
            return tags.filter((t) => ids.includes(t.id));
        },
        [postTags, tags]
    );

    const isTagLinked = useCallback(
        (postId: string, tagId: string) =>
            postTags.some((pt) => pt.postId === postId && pt.tagId === tagId),
        [postTags]
    );

    const toggle = useCallback(
        async (postId: string, tagId: string) => {
            if (isTagLinked(postId, tagId)) {
                await postTagService.delete(postId, tagId);
                setPostTags((pts) =>
                    pts.filter((pt) => !(pt.postId === postId && pt.tagId === tagId))
                );
            } else {
                await postTagService.create(postId, tagId);
                setPostTags((pts) => [...pts, { postId, tagId }]);
            }
        },
        [isTagLinked]
    );

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
                    editingId={editingId}
                    onEditById={handleEditById}
                    onSave={submitForm}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
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

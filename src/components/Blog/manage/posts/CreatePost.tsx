// src/components/Blog/manage/posts/CreatePost.tsx (refactored)
"use client";

import React, { useRef, useCallback } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { usePostManager } from "@entities/models/post";

type IdLike = string | number;

export default function PostManagerPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const manager = usePostManager();
    const { entities: posts, editingId, loadEntityById, deleteById, refresh, cancelEdit } = manager;

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

    const handleSave = useCallback(async () => {
        await refresh();
    }, [refresh]);

    const handleCancel = useCallback(() => {
        cancelEdit();
    }, [cancelEdit]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Posts">
                <SectionHeader className="mt-8">Nouvel article</SectionHeader>
                <PostForm
                    ref={formRef}
                    manager={manager}
                    posts={posts}
                    editingId={editingId}
                    onSave={handleSave}
                />
                <SectionHeader>Liste des articles</SectionHeader>
                <PostList
                    posts={posts}
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

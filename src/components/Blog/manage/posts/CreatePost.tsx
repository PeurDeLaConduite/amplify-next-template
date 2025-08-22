// src/components/Blog/manage/posts/CreatePost.tsx (refactored)
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import { type PostType } from "@entities/models/post/types";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { usePostForm } from "@entities/models/post/hooks";

type IdLike = string | number;

export default function PostManagerPage() {
    const [editingPost, setEditingPost] = useState<PostType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const manager = usePostForm(editingPost);
    const {
        extras: { posts },
        fetchPosts,
        selectById,
        removeById,
        // reset,
    } = manager;

    useEffect(() => {
        void fetchPosts();
    }, [fetchPosts]);

    const selectPost = useCallback(
        (id: IdLike) => {
            const post = selectById(String(id));
            setEditingPost(post ?? null);
        },
        [selectById]
    );

    const enterEditMode = useCallback((id: IdLike) => {
        setEditingId(String(id));
    }, []);

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
        },
        [removeById]
    );

    const handleSave = useCallback(async () => {
        await fetchPosts();
        setEditingPost(null);
        setEditingId(null);
    }, [fetchPosts]);

    const handleCancel = useCallback(() => {
        setEditingPost(null);
        setEditingId(null);
    }, []);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Posts">
                <SectionHeader className="mt-8">Nouvel article</SectionHeader>
                <PostForm
                    ref={formRef}
                    manager={manager}
                    posts={posts}
                    editingId={editingId}
                    afterSave={handleSave}
                />
                <SectionHeader>Liste des articles</SectionHeader>
                <PostList
                    posts={posts}
                    editingId={editingId}
                    selectById={selectPost}
                    enterEditMode={enterEditMode}
                    requestSubmit={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

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
    } = manager;

    useEffect(() => {
        void fetchPosts();
    }, [fetchPosts]);

    const handleEditById = useCallback(
        (id: string) => {
            const post = selectById(id);
            if (!post) return;
            setEditingPost(post);
            setEditingId(id);
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: string) => {
            await removeById(id);
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

// src/components/Blog/manage/posts/CreatePost.tsx (refactored)
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import { postService } from "@entities/models/post/service";
import { type PostType } from "@entities/models/post/types";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { usePostForm } from "@entities/models/post/hooks";

export default function PostManagerPage() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [editingPost, setEditingPost] = useState<PostType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const manager = usePostForm(editingPost);

    const fetchPosts = useCallback(async () => {
        const { data } = await postService.list();
        setPosts(data ?? []);
    }, []);

    useEffect(() => {
        void fetchPosts();
    }, [fetchPosts]);

    const handleEditById = (id: string) => {
        const post = posts.find((p) => p.id === id);
        if (!post) return;
        setEditingPost(post);
        setEditingId(id);
    };

    const handleDeleteById = async (id: string) => {
        if (!confirm("Supprimer ce post ?")) return;
        await postService.delete({ id });
        await fetchPosts();
    };

    const handleSave = async () => {
        await fetchPosts();
        setEditingPost(null);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingPost(null);
        setEditingId(null);
    };

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Posts">
                <SectionHeader className="mt-8">Nouvel article</SectionHeader>
                <PostForm ref={formRef} manager={manager} posts={posts} onSave={handleSave} />
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

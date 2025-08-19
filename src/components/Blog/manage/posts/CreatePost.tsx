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
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const manager = usePostForm(editingPost);

    const fetchPosts = useCallback(async () => {
        const { data } = await postService.list();
        setPosts(data ?? []);
    }, []);

    useEffect(() => {
        void fetchPosts();
    }, [fetchPosts]);

    const handleEdit = (idx: number) => {
        setEditingPost(posts[idx]);
        setEditingIndex(idx);
    };

    const handleDelete = async (idx: number) => {
        if (!confirm("Supprimer ce post ?")) return;
        const id = posts[idx].id;
        await postService.delete({ id });
        await fetchPosts();
    };

    const handleSave = async () => {
        await fetchPosts();
        setEditingPost(null);
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingPost(null);
        setEditingIndex(null);
    };

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Posts">
                <SectionHeader className="mt-8">Nouvel article</SectionHeader>
                <PostForm ref={formRef} manager={manager} posts={posts} onSave={handleSave} />
                <SectionHeader>Liste des articles</SectionHeader>
                <PostList
                    posts={posts}
                    editingIndex={editingIndex}
                    onEdit={handleEdit}
                    onSave={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

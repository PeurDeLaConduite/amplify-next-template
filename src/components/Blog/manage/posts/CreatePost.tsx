// src/components/Blog/manage/posts/CreatePost.tsx (refactored)
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { type PostType, usePostForm } from "@entities/models/post/";

type IdLike = string | number;

export default function PostManagerPage() {
    const [postToEdit, setPostToEdit] = useState<PostType | null>(null);
    const postId = postToEdit?.id ?? null;
    const formRef = useRef<HTMLFormElement>(null);

    const manager = usePostForm(postToEdit);
    const {
        extras: { posts },
        listPosts,
        selectById,
        removeById,
    } = manager;

    useEffect(() => {
        void listPosts();
    }, [listPosts]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const post = selectById(String(id)); // set déjà l'ID dans le hook + mode "edit"
            if (post) setPostToEdit(post);
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
        },
        [removeById]
    );

    const handleSaved = useCallback(async () => {
        await listPosts();
        setPostToEdit(null);
    }, [listPosts]);

    const handleCancel = useCallback(() => {
        setPostToEdit(null);
    }, []);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Posts">
                <SectionHeader className="mt-8">Nouvel article</SectionHeader>
                <PostForm
                    ref={formRef}
                    postFormManager={manager}
                    posts={posts}
                    editingId={postId}
                    onSaveSuccess={handleSaved}
                />

                <SectionHeader>Liste des articles</SectionHeader>
                <PostList
                    posts={posts}
                    postId={postId}
                    onEditById={handleEditById}
                    onUpdate={() => formRef.current?.requestSubmit()}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

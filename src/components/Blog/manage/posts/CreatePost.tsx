"use client";
import React, { useState, useEffect, useRef } from "react";
import PostList from "./PostList";
import PostForm from "./PostForm";
import { postService } from "@entities/models/post/service";
import { type PostType } from "@entities/models/post/types";
import RequireAdmin from "../../../RequireAdmin";
export default function PostManagerPage() {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [editingPost, setEditingPost] = useState<PostType | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const fetchPosts = async () => {
        const { data } = await postService.list();
        setPosts(data ?? []);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Edition par index (comme SectionManagerPage)
    const handleEdit = (id: string) => {
        const post = posts.find((p) => p.id === id) ?? null;
        setEditingPost(post);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce post ?")) return;
        await postService.delete({ id });
        await fetchPosts();
    };

    const handleSave = () => {
        fetchPosts();
        setEditingPost(null);
    };

    const handleCancel = () => {
        setEditingPost(null);
    };

    return (
        <RequireAdmin>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Gestion des Posts</h1>
                <PostForm ref={formRef} post={editingPost} posts={posts} onSave={handleSave} />
                <PostList
                    posts={posts}
                    editingId={editingPost?.id ?? null}
                    onEdit={handleEdit}
                    onSave={() => {
                        // Appelle le submit du formulaire via la ref
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </div>
        </RequireAdmin>
    );
}

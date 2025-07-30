"use client";
import React, { useState, useEffect, useRef } from "react";
import { client } from "@/src/services/amplifyClient";
import PostList from "./PostList";
import PostForm from "./PostForm";
import type { Post } from "@/src/types";

export default function PostManagerPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const fetchPosts = async () => {
        const { data } = await client.models.Post.list();
        setPosts(data ?? []);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Edition par index (comme SectionManagerPage)
    const handleEdit = (idx: number) => {
        setEditingPost(posts[idx]);
        setEditingIndex(idx);
    };

    const handleDelete = async (idx: number) => {
        if (!confirm("Supprimer ce post ?")) return;
        const id = posts[idx].id;
        await client.models.Post.delete({ id });
        await fetchPosts();
    };

    const handleSave = () => {
        fetchPosts();
        setEditingPost(null);
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingPost(null);
        setEditingIndex(null);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gestion des Posts</h1>
            <PostForm ref={formRef} post={editingPost} posts={posts} onSave={handleSave} />
            <PostList
                posts={posts}
                editingIndex={editingIndex}
                onEdit={handleEdit}
                onSave={() => {
                    // Appelle le submit du formulaire via la ref
                    formRef.current?.requestSubmit();
                }}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </div>
    );
}

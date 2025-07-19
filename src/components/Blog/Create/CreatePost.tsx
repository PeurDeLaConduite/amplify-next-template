// src/components/Blog/Create/CreatePost.tsx
"use client";
import React, { useState, useEffect } from "react";
import PostsForm from "./PostsForm";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import RequireAdmin from "../../RequireAdmin";

Amplify.configure(outputs);
const client = generateClient<Schema>();
type PostFormData = Schema["Post"]["type"];
export default function CreatePost() {
    const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
    const [sections, setSections] = useState<Schema["Section"]["type"][]>([]);
    const [authors, setAuthors] = useState<Schema["Author"]["type"][]>([]);
    const [tags, setTags] = useState<Schema["Tag"]["type"][]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [postTags, setPostTags] = useState<Schema["PostTag"]["type"][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    // ÉTAT CRUD TAGS
    const [newTag, setNewTag] = useState("");
    const [editTagId, setEditTagId] = useState<string | null>(null);
    const [editTagName, setEditTagName] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [postsData, sectionsData, authorsData, tagsData] = await Promise.all([
                    client.models.Post.list(),
                    client.models.Section.list(),
                    client.models.Author.list(),
                    client.models.Tag.list(),
                    client.models.PostTag.list(),
                ]);
                setPosts(postsData.data);
                setSections(sectionsData.data);
                setAuthors(authorsData.data);
                setTags(tagsData.data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Ajout tag
    const handleAddTag = async (name: string) => {
        await client.models.Tag.create({ name });
        const tagsData = await client.models.Tag.list();
        setTags(tagsData.data);
    };

    // Édition tag
    const handleUpdateTag = async () => {
        if (!editTagId || !editTagName.trim()) return;
        await client.models.Tag.update({ id: editTagId, name: editTagName.trim() });
        setTags((prev) =>
            prev.map((tag) => (tag.id === editTagId ? { ...tag, name: editTagName.trim() } : tag))
        );
        setEditTagId(null);
        setEditTagName("");
    };
    // Suppression tag
    const handleDeleteTag = async (id: string) => {
        await client.models.Tag.delete({ id });
        setTags((prev) => prev.filter((tag) => tag.id !== id));
    };

    // Ajout d’un post (exemple simplifié)
    const handleAddPost = async (form: PostFormData) => {
        try {
            await client.models.Post.create({
                ...form,
            });

            const postsData = await client.models.Post.list();
            setPosts(postsData.data);

            setMessage("✅ Article ajouté !");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            setMessage("❌ Erreur lors de l'ajout");
        }
    };
    const handleUpdatePost = async (form: PostFormData) => {
        try {
            await client.models.Post.update({ ...form });

            const postsData = await client.models.Post.list();
            setPosts(postsData.data);

            setMessage("✅ Article mis à jour !");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            setMessage("❌ Erreur lors de la mise à jour");
        }
    };

    // Suppression d’un post
    const handleDeletePost = async (id: string) => {
        if (!confirm("Supprimer cet article ?")) return;
        try {
            await client.models.Post.delete({ id });
            setPosts((prev) => prev.filter((p) => p.id !== id));
            setMessage("✅ Article supprimé !");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err));
            setMessage("❌ Erreur lors de la suppression");
        }
    };

    if (loading) return <p>Chargement des données…</p>;
    if (error) return <p className="text-red-600">Erreur : {error}</p>;

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur des Articles</h1>
                <PostsForm
                    posts={posts}
                    setPosts={setPosts}
                    sections={sections}
                    setSections={setSections}
                    authors={authors}
                    tags={tags}
                    setTags={setTags}
                    newTag={newTag}
                    setNewTag={setNewTag}
                    editTagId={editTagId}
                    setEditTagId={setEditTagId}
                    editTagName={editTagName}
                    setEditTagName={setEditTagName}
                    onAdd={handleAddPost}
                    onUpdate={handleUpdatePost}
                    onDelete={handleDeletePost}
                    onAddTag={handleAddTag}
                    onUpdateTag={handleUpdateTag}
                    onDeleteTag={handleDeleteTag}
                />
                {message && <p className="mt-2 text-sm">{message}</p>}
            </div>
        </RequireAdmin>
    );
}

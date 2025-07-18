"use client";

import React, { useState, useEffect } from "react";
import SectionsForm from "./SectionsForm";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import RequireAdmin from "../../RequireAdmin";

Amplify.configure(outputs);
const client = generateClient<Schema>();
type SectionForm = {
    slug: string;
    title: string;
    description?: string;
    order: number;
    seo: {
        title: string;
        description: string;
        image: string;
    };
    postIds: string[]; // si tu passes les posts liés dans le form
};
export default function CreateSection() {
    const [sections, setSections] = useState<Schema["Section"]["type"][] | undefined>(undefined);
    const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Charge Sections
        const subSection = client.models.Section.observeQuery().subscribe({
            next: (data) => setSections(data.items),
            error: (err) => setError(err),
        });
        // Charge Posts
        const subPosts = client.models.Post.observeQuery().subscribe({
            next: (data) => setPosts(data.items),
            error: (err) => setError(err),
        });
        setLoading(false);
        return () => {
            subSection.unsubscribe();
            subPosts.unsubscribe();
        };
    }, []);

    // CRUD Section
    const handleAddSection = async (form: SectionForm) => {
        try {
            const section = await client.models.Section.create({
                slug: form.slug,
                title: form.title,
                description: form.description,
                order: form.order,
                seo: form.seo,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            setMessage("Section ajoutée !");
            return section; // Pour chainage
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setMessage("Erreur lors de l'ajout");
        }
    };

    const handleUpdateSection = async (id: string, form: SectionForm) => {
        try {
            await client.models.Section.update({
                id,
                slug: form.slug,
                title: form.title,
                description: form.description,
                order: form.order,
                seo: form.seo,
                updatedAt: new Date().toISOString(),
            });
            setMessage("Section mise à jour !");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setMessage("Erreur lors de la mise à jour");
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (!window.confirm("Supprimer cette section ?")) return;
        try {
            await client.models.Section.delete({ id });
            setMessage("Section supprimée !");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setMessage("Erreur lors de la suppression");
        }
    };

    if (loading) return <p>Chargement…</p>;
    if (error) return <p className="text-red-600">Erreur : {error}</p>;

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de contenu blog : Sections</h1>
                <SectionsForm
                    sections={sections}
                    posts={posts}
                    onAdd={handleAddSection}
                    onUpdate={handleUpdateSection}
                    onDelete={handleDeleteSection}
                    client={client}
                />
                {message && (
                    <p
                        className={`mt-2 text-sm ${
                            message.startsWith("Erreur") ? "text-red-600" : "text-green-600"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </RequireAdmin>
    );
}

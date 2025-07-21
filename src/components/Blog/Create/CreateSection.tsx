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
type Section = Schema["Section"]["type"];
export default function CreateSection() {
    const [sections, setSections] = useState<Schema["Section"]["type"][]>([]);
    const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const subSection = client.models.Section.observeQuery().subscribe({
            next: (data) => setSections(data.items),
            error: (err) =>
                setError(err instanceof Error ? err.message : (err.message ?? JSON.stringify(err))),
        });
        const subPosts = client.models.Post.observeQuery().subscribe({
            next: (data) => setPosts(data.items),
            error: (err) =>
                setError(err instanceof Error ? err.message : (err.message ?? JSON.stringify(err))),
        });

        setLoading(false);
        return () => {
            subSection.unsubscribe();
            subPosts.unsubscribe();
        };
    }, []);

    // CRUD Section
    // CreateSection.tsx (extrait de handleCreateSection)

    // avant : Promise<SectionForm>
    const handleCreateSection = async (form: SectionForm): Promise<Section> => {
        const { data: section, errors } = await client.models.Section.create({
            slug: form.slug,
            title: form.title,
            description: form.description,
            order: form.order,
            seo: form.seo,
        });
        if (errors?.length) {
            const message = errors.map((e) => e.message).join(", ");
            setError(message);
            setMessage("Erreur lors de l'ajout");
            throw new Error(message);
        }
        if (!section) {
            const message = "Aucune donnée retournée";
            setError(message);
            setMessage("Erreur lors de l'ajout");
            throw new Error(message);
        }
        setMessage("Section ajoutée !");
        return section;
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
    if (error)
        return (
            <p className="text-red-600">
                Erreur : {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
            </p>
        );

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de contenu blog : Sections</h1>
                <SectionsForm
                    sections={sections}
                    posts={posts}
                    onAdd={handleCreateSection}
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

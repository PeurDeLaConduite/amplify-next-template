"use client";

import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import RequireAdmin from "../../RequireAdmin";
import AuthorsForm from "./AuthorsForm";

Amplify.configure(outputs);

const client = generateClient<Schema>();

type AuthorType = Schema["Author"]["type"];
type AuthorsType = AuthorType[];

export default function CreateAuthor() {
    const [localAuthors, setLocalAuthors] = useState<AuthorsType>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const sub = client.models.Author.observeQuery().subscribe({
            next: (data) => {
                setLocalAuthors(data.items);
                setLoading(false);
            },
            error: (err) => setError(err as Error),
        });
        return () => sub.unsubscribe();
    }, []);

    const handleAddAuthor = async (authorData: AuthorType) => {
        setMessage("");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, ...rest } = authorData;
        setLocalAuthors([{ ...rest, id: "tmp-" + Math.random() }, ...localAuthors]);
        try {
            await client.models.Author.create(rest);
            setMessage("Auteur ajouté !");
        } catch (err) {
            setError(err as Error);
            setMessage("Erreur lors de l'ajout");
        }
    };

    const handleUpdateAuthor = async (id: string, authorData: AuthorType) => {
        setMessage("");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _removed, ...rest } = authorData;
        setLocalAuthors(localAuthors.map((a) => (a.id === id ? { ...a, ...rest } : a)));
        try {
            await client.models.Author.update({ id, ...rest });
            setMessage("Auteur mis à jour !");
        } catch (err) {
            setError(err as Error);
            setMessage("Erreur lors de la mise à jour");
        }
    };

    const handleDeleteAuthor = async (id: string) => {
        if (!window.confirm("Supprimer cet auteur ?")) return;
        setMessage("");
        setLocalAuthors(localAuthors.filter((a) => a.id !== id));
        try {
            await client.models.Author.delete({ id });
            setMessage("Auteur supprimé !");
        } catch (err) {
            setError(err as Error);
            setMessage("Erreur lors de la suppression");
        }
    };

    if (loading) return <p>Chargement…</p>;
    if (error) return <p className="text-red-600">Erreur : {error.message}</p>;

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de contenu blog : Auteurs</h1>
                <AuthorsForm
                    authors={localAuthors}
                    onAdd={handleAddAuthor}
                    onUpdate={handleUpdateAuthor}
                    onDelete={handleDeleteAuthor}
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

"use client";

import React, { useEffect, useState } from "react";
import RequireAdmin from "../../../RequireAdmin";
import AuthorsForm from "./AuthorsForm";
import { client } from "@/src/services";
import type { Author } from "@src/entities";

type AuthorType = Author;
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

    if (loading) return <p>Chargement…</p>;
    if (error) return <p className="text-red-600">Erreur : {error.message}</p>;

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de blog : Auteurs</h1>
                <AuthorsForm authors={localAuthors} setMessage={setMessage} />
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

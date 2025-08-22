// app/blog/BlogClientWrapper.tsx
"use client";
import React, { useEffect, useState } from "react";
import Blog from "@components/Blog/Blog";
import { RefreshButton } from "@components/ui/Button";
import { fetchBlogData } from "@src/services";
import type { BlogData } from "@src/types/blog";

export default function BlogClientWrapper() {
    const [data, setData] = useState<BlogData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const result = await fetchBlogData();
            setData(result);
            setError(null);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        void load();
    }, []);

    if (loading) return <p>Chargement…</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Blog data={data!} noWrapper />
            <RefreshButton
                onClick={load}
                label="Actualiser la liste d'articles"
                className="mb-6"
                size="medium"
            />
        </div>
    );
}

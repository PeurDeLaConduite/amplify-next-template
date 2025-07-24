// app/blog/BlogClientWrapper.tsx
"use client";
import React from "react";
import { DataBlogProvider, useDataBlog } from "@context/DataBlogProvider";
import Blog from "@/src/components/Blog/Blog";
import { RefreshButton } from "@/src/components/buttons/Buttons";

function InnerBlog() {
    const { data, loading, error, refresh } = useDataBlog();

    if (loading) return <p>Chargement…</p>;
    if (error) return <p>Erreur : {error.message}</p>;
    console.log(data);
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* On passe noWrapper pour éviter un deuxième conteneur */}
            <Blog data={data!} noWrapper />
            <RefreshButton
                onClick={refresh}
                label="Actualiser la liste d'articles"
                className="mb-6"
            />
        </div>
    );
}

export default function BlogClientWrapper() {
    return (
        <DataBlogProvider>
            <InnerBlog />
        </DataBlogProvider>
    );
}

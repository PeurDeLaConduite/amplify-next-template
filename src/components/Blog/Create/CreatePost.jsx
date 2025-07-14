// CreateBlog.jsx
"use client";

import React, { useState, useEffect } from "react";
import SectionsForm from "./SectionsForm";
import PostsForm from "./PostsForm";
import AuthorsForm from "./AuthorsForm";
import { loadData } from "@utils/loadData";
import { uploadData } from "aws-amplify/storage";
import RequireAdmin from "../../RequireAdmin";
export default function CreatePost() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");

    // Charge les données existantes au montage
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await loadData();
                setSections(data.sections || []);
                setPosts(data.posts || []);
                setAuthors(data.authors || []);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Génération et upload du JSON
    const handleUploadJSON = async () => {
        const payload = { sections, posts, authors };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: "application/json",
        });

        try {
            setMessage("Publication en cours…");
            await uploadData({
                path: `publique-storage/data.json`,
                data: blob,
                options: { bucket: "PubliqueStorage" },
            }).result;
            setMessage("✅ Le fichier data.json a bien été publié !");
        } catch (err) {
            console.error(err);
            setMessage("❌ Erreur lors de la publication.");
        }
    };

    if (loading) return <p>Chargement des données…</p>;
    if (error) return <p className="text-red-600">Erreur : {error.message}</p>;

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de contenu du blog : Articles</h1>
                <PostsForm
                    posts={posts}
                    setPosts={setPosts}
                    sections={sections}
                    authors={authors}
                />
                <SectionsForm
                    sections={sections}
                    setSections={setSections}
                    posts={posts}
                    setPosts={setPosts}
                />
                <AuthorsForm authors={authors} setAuthors={setAuthors} />
                <div className="flex flex-col items-start gap-4">
                    <button
                        onClick={handleUploadJSON}
                        className="px-4 py-2 rounded-lg font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Publier le JSON (data.json)
                    </button>

                    {message && (
                        <p
                            className={`mt-2 text-sm ${
                                message.startsWith("✅") ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </RequireAdmin>
    );
}

"use client";

import { useState } from "react";
import type { OutputData } from "@editorjs/editorjs";
import Editor from "@components/Editor";
import { useCreateArticle } from "@hooks/useCreateArticle";

export default function NewArticlePage() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState<OutputData | undefined>();
    const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT");
    const { createArticle } = useCreateArticle();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createArticle({ title, summary, content, status });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                className="border p-2 w-full"
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                className="border p-2 w-full"
                placeholder="Résumé"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <Editor data={content} onChange={setContent} />
            <select
                className="border p-2"
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
            >
                <option value="DRAFT">Brouillon</option>
                <option value="PUBLISHED">Publié</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
                Enregistrer
            </button>
        </form>
    );
}

// PostForm.tsx
"use client";
import React from "react";
import { usePostForm } from "./usePostForm";
import { Schema } from "@/amplify/data/resource";

export default function PostForm({
    post,
    onSave,
}: {
    post: Schema["Post"]["type"] | null;
    onSave: () => void;
}) {
    const {
        form,
        seo,
        authors,
        tags,
        sections,
        selectedTagIds,
        selectedSectionIds,
        handlePostChange,
        handleSeoChange,
        handleTitleFocus,
        handleTitleBlur,
        toggleTag,
        toggleSection,
        handleSubmit,
    } = usePostForm(post, onSave);

    return (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
            <input
                name="title"
                value={form.title}
                onChange={handlePostChange}
                onFocus={handleTitleFocus}
                onBlur={handleTitleBlur}
                placeholder="Titre"
                className="border p-2 w-full"
            />

            <input
                name="slug"
                value={form.slug}
                onChange={handlePostChange}
                placeholder="Slug"
                className="border p-2 w-full"
            />
            <fieldset className="border p-2 space-y-2">
                <legend className="font-semibold">SEO</legend>
                <input
                    name="title"
                    value={seo.title}
                    onChange={handleSeoChange}
                    placeholder="SEO Title"
                    className="border p-2 w-full"
                />
                <input
                    name="description"
                    value={seo.description}
                    onChange={handleSeoChange}
                    placeholder="SEO Description"
                    className="border p-2 w-full"
                />
                <input
                    name="image"
                    value={seo.image}
                    onChange={handleSeoChange}
                    placeholder="SEO Image URL"
                    className="border p-2 w-full"
                />
            </fieldset>
            <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handlePostChange}
                placeholder="Résumé"
                className="border p-2 w-full"
            />
            <textarea
                name="content"
                value={form.content}
                onChange={handlePostChange}
                placeholder="Contenu"
                className="border p-2 w-full"
            />

            <select
                name="status"
                value={form.status}
                onChange={handlePostChange}
                className="border p-2 w-full"
            >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
            </select>

            <select
                name="authorId"
                value={form.authorId}
                onChange={handlePostChange}
                className="border p-2 w-full"
            >
                <option value="">Sélectionner un auteur</option>
                {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                        {a.name}
                    </option>
                ))}
            </select>

            <fieldset className="border p-2 space-y-2">
                <legend className="font-semibold">Tags</legend>
                {tags.map((tag) => (
                    <label key={tag.id} className="block">
                        <input
                            type="checkbox"
                            checked={selectedTagIds.includes(tag.id)}
                            onChange={() => toggleTag(tag.id)}
                        />
                        <span className="ml-2">{tag.name}</span>
                    </label>
                ))}
            </fieldset>

            <fieldset className="border p-2 space-y-2">
                <legend className="font-semibold">Sections</legend>
                {sections.map((section) => (
                    <label key={section.id} className="block">
                        <input
                            type="checkbox"
                            checked={selectedSectionIds.includes(section.id)}
                            onChange={() => toggleSection(section.id)}
                        />
                        <span className="ml-2">{section.title}</span>
                    </label>
                ))}
            </fieldset>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {post ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
}

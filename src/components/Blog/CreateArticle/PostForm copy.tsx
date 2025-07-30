"use client";
import React from "react";
import EditableField from "../Create/components/EditableField";
import SeoFields from "../Create/components/SeoFields";
import OrderSelector from "../Create/components/OrderSelector";
import ItemSelector from "../Create/components/ItemSelector";
import { usePostForm } from "./usePostForm";
import type { Schema } from "@/amplify/data/resource";

export default function PostForm({
    post,
    onSave,
    posts = [],
}: {
    post: Schema["Post"]["type"] | null;
    onSave: () => void;
    posts?: Schema["Post"]["type"][]; // pour OrderSelector si besoin (liste complète)
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
        handleExcerptFocus,
        handleExcerptBlur,
        toggleTag,
        toggleSection,
        handleSubmit,
        setForm,
    } = usePostForm(post, onSave);

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
                onChange={handlePostChange}
                onFocus={handleTitleFocus}
                onBlur={handleTitleBlur}
                readOnly={false}
            />
            <EditableField
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={handlePostChange}
                readOnly={false}
            />
            <EditableField
                name="excerpt"
                label="Résumé"
                value={form.excerpt}
                onChange={handlePostChange}
                onFocus={handleExcerptFocus}
                onBlur={handleExcerptBlur}
                readOnly={false}
            />
            <EditableField
                name="content"
                label="Contenu"
                value={form.content}
                onChange={handlePostChange}
                readOnly={false}
                multiline
            />

            <OrderSelector
                // Utilise la liste des posts pour l'ordre global, sinon adapte avec sections si besoin
                sections={posts}
                currentIndex={posts.findIndex((p) => p.id === post?.id)}
                value={form.order ?? 0}
                onReorder={(_, newOrder) => setForm((f) => ({ ...f, order: newOrder }))}
            />

            <SeoFields seo={seo} onChange={handleSeoChange} readOnly={false} />

            <ItemSelector
                items={tags}
                idKey="id"
                selectedIds={selectedTagIds}
                onChange={(ids) => {
                    // Si le comportement natif ne convient pas, garde toggleTag
                    setForm((f) => ({ ...f })); // (ou juste trigger un refresh, au besoin)
                }}
                label="Tags associés :"
                getLabel={(tag) => tag.name}
                // multiple
                onToggle={toggleTag}
            />

            <ItemSelector
                items={sections}
                idKey="id"
                selectedIds={selectedSectionIds}
                onChange={(ids) => {
                    // Idem que pour tags, sinon utilise toggleSection
                    setForm((f) => ({ ...f }));
                }}
                label="Sections associées :"
                getLabel={(section) => section.title}
                // multiple
                onToggle={toggleSection}
            />

            <EditableField
                name="status"
                label="Statut"
                value={form.status}
                onChange={handlePostChange}
                readOnly={false}
                select
                options={[
                    { value: "draft", label: "Brouillon" },
                    { value: "published", label: "Publié" },
                ]}
            />
            <EditableField
                name="authorId"
                label="Auteur"
                value={form.authorId}
                onChange={handlePostChange}
                readOnly={false}
                select
                options={[
                    { value: "", label: "Sélectionner un auteur" },
                    ...authors.map((a) => ({ value: a.id, label: a.name })),
                ]}
            />

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {post ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
}

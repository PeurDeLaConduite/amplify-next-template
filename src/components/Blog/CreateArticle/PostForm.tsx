// PostForm.tsx
"use client";
import React, { forwardRef } from "react";
import { usePostForm } from "./usePostForm";
import EditableField from "../Create/components/EditableField";
import EditableTextArea from "../Create/components/EditableTextArea";
import SeoFields from "../Create/components/SeoFields";
import OrderSelector from "../Create/components/OrderSelector";
import type { Post } from "@/src/types";

interface Props {
    post: Post | null;
    onSave: () => void;
    posts: Post[];
}

const PostForm = forwardRef<HTMLFormElement, Props>(function SectionForm(
    { post, onSave, posts },
    ref
) {
    const {
        form,
        seo,
        authors,
        tags,
        sections,
        selectedTagIds,
        selectedSectionIds,
        handlePostChange,
        handleTitleFocus,
        handleTitleBlur,
        handleExcerptFocus,
        handleExcerptBlur,
        toggleTag,
        toggleSection,
        handleSubmit,
        setForm, // Récupère-la bien ici aussi
    } = usePostForm(post, onSave);

    return (
        <form
            ref={ref}
            onSubmit={(e) => {
                handleSubmit(e);
            }}
            className="mb-4 space-y-2"
        >
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
                onChange={handlePostChange}
                onFocus={handleTitleFocus}
                onBlur={handleTitleBlur}
                readOnly={false}
            />
            <EditableTextArea
                name="excerpt"
                label="Résumé"
                value={form.excerpt ?? ""}
                onChange={handlePostChange}
                onFocus={handleExcerptFocus}
                onBlur={handleExcerptBlur}
                readOnly={false}
            />
            <EditableField
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={handlePostChange}
                readOnly={false}
            />
            <SeoFields
                seo={{
                    title: seo.title ?? "",
                    description: seo.description ?? "",
                    image: seo.image ?? "",
                }}
                onChange={handlePostChange}
                readOnly={false}
            />

            <EditableTextArea
                name="content"
                label="Contenu"
                value={form.content ?? ""}
                onChange={handlePostChange}
                readOnly={false}
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
            <OrderSelector
                sections={posts} // tu passes la bonne liste ici
                currentIndex={posts.findIndex((p) => p.id === post?.id)}
                value={form.order}
                onReorder={(_: number, newOrder: number) =>
                    setForm((f) => ({ ...f, order: newOrder }))
                }
            />
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
                {sections
                    .slice() // pour ne pas modifier le tableau d'origine
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((section) => (
                        <label key={section.id} className="block">
                            <input
                                type="checkbox"
                                checked={selectedSectionIds.includes(section.id)}
                                onChange={() => toggleSection(section.id)}
                            />
                            <span className="ml-2">{section.title}</span>
                            <span className="ml-2">ordre : {section.order}</span>
                        </label>
                    ))}
            </fieldset>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {post ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
});

export default PostForm;

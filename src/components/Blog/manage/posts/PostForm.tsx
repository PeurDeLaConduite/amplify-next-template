// PostForm.tsx
"use client";
import React, { forwardRef } from "react";
import { usePostForm } from "@entities/models/post/hooks";
import EditableField from "../components/EditableField";
import EditableTextArea from "../components/EditableTextArea";
import SeoFields from "../components/SeoFields";
import OrderSelector from "../components/OrderSelector";
import SelectField from "../components/SelectField";
import { type PostType } from "@/src/entities/models/post";

interface Props {
    post: PostType | null;
    onSave: () => void;
    posts: PostType[];
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
            <SelectField
                label="Statut"
                name="status"
                value={form.status ?? ""}
                onChange={handlePostChange}
                options={[
                    { value: "draft", label: "Brouillon" },
                    { value: "published", label: "Publié" },
                ]}
            />
            <SelectField
                label="Auteur"
                name="authorId"
                value={form.authorId}
                onChange={handlePostChange}
                options={[
                    { value: "", label: "Sélectionner un auteur" },
                    ...authors.map((a) => ({ value: a.id, label: a.authorName })),
                ]}
            />
            <OrderSelector
                sections={posts} // tu passes la bonne liste ici
                currentIndex={posts.findIndex((p) => p.id === post?.id)}
                value={form.order ?? 1}
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
                            checked={form.tagIds.includes(tag.id)}
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
                                checked={form.sectionIds.includes(section.id)}
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

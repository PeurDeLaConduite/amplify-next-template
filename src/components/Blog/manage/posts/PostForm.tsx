// src/components/Blog/manage/posts/PostForm.tsx (refactored)
"use client";

import React, { forwardRef, type ChangeEvent } from "react";
import { usePostForm } from "@entities/models/post/hooks";
import { initialPostForm } from "@entities/models/post/form";
import { useAutoGenFields, slugify } from "@hooks/useAutoGenFields";
import {
    EditableField,
    EditableTextArea,
    SeoFields,
    OrderSelector,
    SelectField,
} from "@components/ui/Form";
import BlogFormShell from "@components/Blog/manage/BlogFormShell";
import { byAlpha, byOptionalOrder } from "@components/Blog/manage/sorters";
import { type SeoFormType } from "@entities/customTypes/seo/types";
import { type PostFormType } from "@entities/models/post/types";
import { type PostType } from "@entities/models/post";

interface Props {
    manager: ReturnType<typeof usePostForm>;
    dispatchEvent: () => void;
    posts: PostType[];
    editingId: string | null;
}

const PostForm = forwardRef<HTMLFormElement, Props>(function PostForm(
    { manager, dispatchEvent, posts, editingId },
    ref
) {
    const {
        form,
        extras: { authors, tags, sections },
        handleChange,
        toggleTag,
        toggleSection,
    } = manager;

    const { handleSourceFocus, handleManualEdit } = useAutoGenFields({
        configs: [
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.slug ?? "",
                target: "slug",
                setter: (v) => handleChange("slug", slugify(v ?? "")),
                transform: slugify,
            },
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.seo.title ?? "",
                target: "seo.title",
                setter: (v) => handleChange("seo", { ...form.seo, title: v ?? "" }),
            },
            {
                editingKey: "excerpt",
                source: form.excerpt ?? "",
                current: form.seo.description ?? "",
                target: "seo.description",
                setter: (v) => handleChange("seo", { ...form.seo, description: v ?? "" }),
            },
        ],
    });

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        if (name === "title" || name === "excerpt") handleSourceFocus(name);
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1] as keyof SeoFormType;
            handleChange("seo", { ...form.seo, [key]: value });
            handleManualEdit(`seo.${key}`);
        } else if (name === "slug") {
            handleChange("slug", slugify(value));
            handleManualEdit("slug");
        } else {
            handleChange(name as keyof PostFormType, value as never);
        }
    };

    return (
        <BlogFormShell
            ref={ref}
            manager={manager}
            initialForm={initialPostForm}
            dispatchEvent={dispatchEvent}
            submitLabel={{ create: "Créer l'article", edit: "Mettre à jour" }}
        >
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
                onChange={onChange}
                readOnly={false}
            />
            <EditableTextArea
                name="excerpt"
                label="Résumé"
                value={form.excerpt ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableField
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={onChange}
                readOnly={false}
            />
            <SeoFields
                seo={{
                    title: form.seo.title ?? "",
                    description: form.seo.description ?? "",
                    image: form.seo.image ?? "",
                }}
                onChange={onChange}
                readOnly={false}
            />
            <EditableField
                name="videoUrl"
                label="Video URL"
                value={form.videoUrl ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableTextArea
                name="content"
                label="Contenu"
                value={form.content ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <SelectField
                label="Statut"
                name="status"
                value={form.status ?? ""}
                onChange={onChange}
                options={[
                    { value: "draft", label: "Brouillon" },
                    { value: "published", label: "Publié" },
                ]}
            />
            <SelectField
                label="Auteur"
                name="authorId"
                value={form.authorId}
                onChange={onChange}
                options={[
                    { value: "", label: "Sélectionner un auteur" },
                    ...authors
                        .slice()
                        .sort(byAlpha((a) => a.authorName))
                        .map((a) => ({ value: a.id, label: a.authorName })),
                ]}
            />
            <OrderSelector
                items={posts}
                editingId={editingId}
                value={form.order ?? 1}
                onReorder={(_, newOrder) => handleChange("order", newOrder)}
            />
            <fieldset className="border p-2 space-y-2">
                <legend className="font-semibold">Tags</legend>
                {tags
                    .slice()
                    .sort(byAlpha((a) => a.name))
                    .map((tag) => (
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
                    .slice()
                    .sort(byOptionalOrder)
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
        </BlogFormShell>
    );
});

export default PostForm;

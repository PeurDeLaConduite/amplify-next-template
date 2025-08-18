// PostForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent, type FormEvent } from "react";
import { usePostForm } from "@entities/models/post/hooks";
import { initialPostForm } from "@entities/models/post/form";
import { useAutoGenFields, slugify } from "@hooks/useAutoGenFields";
import EditableField from "@components/forms/EditableField";
import EditableTextArea from "@components/forms/EditableTextArea";
import SeoFields from "@components/forms/SeoFields";
import OrderSelector from "@components/forms/OrderSelector";
import SelectField from "@components/forms/SelectField";
import { type PostType } from "@/src/entities/models/post";
import { type SeoFormType } from "@entities/customTypes/seo/types";
import { type PostFormType } from "@entities/models/post/types";

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
        extras: { authors, tags, sections },
        submit,
        handleChange,
        toggleTag,
        toggleSection,
        setForm,
        setMode,
    } = usePostForm(post);

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
                setter: (v) =>
                    handleChange("seo", {
                        ...form.seo,
                        title: v ?? "",
                    }),
            },
            {
                editingKey: "excerpt",
                source: form.excerpt ?? "",
                current: form.seo.description ?? "",
                target: "seo.description",
                setter: (v) =>
                    handleChange("seo", {
                        ...form.seo,
                        description: v ?? "",
                    }),
            },
        ],
    });

    function handlePostChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        if (name === "title" || name === "excerpt") {
            handleSourceFocus(name);
        }
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
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.authorId) {
            alert("Veuillez sélectionner un auteur.");
            return;
        }
        await submit();
        setMode("create");
        setForm(initialPostForm);
        onSave();
    }

    return (
        <form ref={ref} onSubmit={handleSubmit} className="mb-6 space-y-2">
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
                onChange={handlePostChange}
                readOnly={false}
            />
            <EditableTextArea
                name="excerpt"
                label="Résumé"
                value={form.excerpt ?? ""}
                onChange={handlePostChange}
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
                    title: form.seo.title ?? "",
                    description: form.seo.description ?? "",
                    image: form.seo.image ?? "",
                }}
                onChange={handlePostChange}
                readOnly={false}
            />
            <EditableField
                name="videoUrl"
                label="Video URL"
                value={form.videoUrl ?? ""}
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
                onReorder={(_: number, newOrder: number) => handleChange("order", newOrder)}
            />
            <fieldset className="border p-2 space-y-2">
                <legend className="font-semibold">Tags</legend>
                {tags
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name)) // tri alphabétique
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
            <div className="flex space-x-2">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {post ? "Mettre à jour" : "Créer"}
                </button>
            </div>
        </form>
    );
});

export default PostForm;

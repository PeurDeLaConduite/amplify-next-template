"use client";
import React, { forwardRef } from "react";
import EditableField from "../components/EditableField";
import EditableTextArea from "../components/EditableTextArea";
import SeoFields from "../components/SeoFields";
import OrderSelector from "../components/OrderSelector";
import ItemSelector from "../components/ItemSelector";
import { useSectionForm } from "./useSectionForm";
import type { Section } from "@/src/types";

interface Props {
    section: Section | null;
    onSave: () => void;
    sections: Section[];
}

const SectionForm = forwardRef<HTMLFormElement, Props>(function SectionForm(
    { section, onSave, sections },
    ref
) {
    const {
        form,
        posts,
        saving,
        handleChange,
        handleSubmit,
        setForm,
        handleTitleFocus,
        handleTitleBlur,
    } = useSectionForm(section, onSave);

    return (
        <form
            ref={ref}
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="space-y-2"
        >
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
                onChange={handleChange}
                onFocus={() => handleTitleFocus("title")}
                onBlur={() => handleTitleBlur("title")}
                readOnly={false}
            />
            <EditableField
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={handleChange}
                readOnly={false}
            />
            <EditableTextArea
                name="description"
                label="Description"
                value={form.description ?? ""}
                onChange={handleChange}
                onFocus={() => handleTitleFocus("description")}
                onBlur={() => handleTitleBlur("description")}
                readOnly={false}
            />
            <OrderSelector
                sections={sections}
                currentIndex={sections.findIndex((s) => s.id === section?.id)}
                value={form.order}
                onReorder={(_: number, newOrder: number) =>
                    setForm((f) => ({ ...f, order: newOrder }))
                }
            />
            <SeoFields
                seo={{
                    title: form.seo.title ?? "",
                    description: form.seo.description ?? "",
                    image: form.seo.image ?? "",
                }}
                onChange={handleChange}
                readOnly={false}
            />
            <ItemSelector
                items={posts}
                idKey="id"
                selectedIds={form.postIds}
                onChange={(postIds) => setForm((f) => ({ ...f, postIds }))}
                label="Articles associés :"
                getLabel={(post) => post.title}
            />
            <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                {section ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
});

export default SectionForm;

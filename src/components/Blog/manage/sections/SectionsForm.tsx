// src/components/Blog/manage/sections/SectionForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent } from "react";
import {
    EditableField,
    EditableTextArea,
    SeoFields,
    OrderSelector,
    ItemSelector,
} from "@components/ui/Form";
import { useAutoGenFields, slugify } from "@hooks/useAutoGenFields";
import EntityFormShell from "../EntityFormShell";
import {
    type SectionFormTypes,
    initialSectionForm,
    useSectionForm,
} from "@entities/models/section";

interface Props {
    manager: ReturnType<typeof useSectionForm>;
    onSave: () => void;
    editingId: string | null;
}

const SectionForm = forwardRef<HTMLFormElement, Props>(function SectionForm(
    { manager, onSave, editingId },
    ref
) {
    const {
        form,
        extras: { posts, sections },
        handleChange,
        setForm,
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
                editingKey: "description",
                source: form.description ?? "",
                current: form.seo.description ?? "",
                target: "seo.description",
                setter: (v) => handleChange("seo", { ...form.seo, description: v ?? "" }),
            },
        ],
    });

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "title" || name === "description") handleSourceFocus(name);
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1] as keyof SectionFormTypes["seo"];
            handleChange("seo", { ...form.seo, [key]: value });
            handleManualEdit(`seo.${key}`);
        } else if (name === "slug") {
            handleChange("slug", slugify(value));
            handleManualEdit("slug");
        } else {
            handleChange(name as keyof SectionFormTypes, value as never);
        }
    };

    return (
        <EntityFormShell
            ref={ref}
            manager={manager}
            initialForm={initialSectionForm}
            onSave={onSave}
        >
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
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
            <EditableTextArea
                name="description"
                label="Description"
                value={form.description ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <OrderSelector
                items={sections}
                editingId={editingId}
                value={form.order ?? 1}
                onReorder={(_, newOrder) => handleChange("order", newOrder)}
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
            <ItemSelector
                items={posts}
                idKey="id"
                selectedIds={form.postIds}
                onChange={(postIds) => setForm((f) => ({ ...f, postIds }))}
                label="Articles associés :"
                getLabel={(post) => post.title}
            />
        </EntityFormShell>
    );
});

export default SectionForm;

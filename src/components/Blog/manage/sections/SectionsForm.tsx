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
import BlogFormShell from "../BlogFormShell";
import {
    type SectionFormTypes,
    initialSectionForm,
    useSectionForm,
} from "@entities/models/section";

interface Props {
    sectionFormManager: ReturnType<typeof useSectionForm>;
    onSaveSuccess: () => void;
    sectionId: string | null;
}

const SectionForm = forwardRef<HTMLFormElement, Props>(function SectionForm(
    { sectionFormManager, onSaveSuccess, sectionId },
    ref
) {
    const {
        form,
        extras: { posts, sections },
        setFieldValue,
        setForm,
    } = sectionFormManager;

    const { handleSourceFocus, handleManualEdit } = useAutoGenFields({
        configs: [
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.slug ?? "",
                target: "slug",
                setter: (v) => setFieldValue("slug", slugify(v ?? "")),
                transform: slugify,
            },
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.seo.title ?? "",
                target: "seo.title",
                setter: (v) => setFieldValue("seo", { ...form.seo, title: v ?? "" }),
            },
            {
                editingKey: "description",
                source: form.description ?? "",
                current: form.seo.description ?? "",
                target: "seo.description",
                setter: (v) => setFieldValue("seo", { ...form.seo, description: v ?? "" }),
            },
        ],
    });

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "title" || name === "description") handleSourceFocus(name);
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1] as keyof SectionFormTypes["seo"];
            setFieldValue("seo", { ...form.seo, [key]: value });
            handleManualEdit(`seo.${key}`);
        } else if (name === "slug") {
            setFieldValue("slug", slugify(value));
            handleManualEdit("slug");
        } else {
            setFieldValue(name as keyof SectionFormTypes, value as never);
        }
    };

    return (
        <BlogFormShell
            ref={ref}
            blogFormManager={sectionFormManager}
            initialForm={initialSectionForm}
            onSaveSuccess={onSaveSuccess}
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
                editingId={sectionId}
                value={form.order ?? 1}
                onReorder={(_, newOrder) => setFieldValue("order", newOrder)}
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
        </BlogFormShell>
    );
});

export default SectionForm;

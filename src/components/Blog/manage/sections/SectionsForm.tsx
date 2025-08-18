"use client";
import React, { forwardRef, type ChangeEvent, type FormEvent } from "react";
import EditableField from "@components/forms/EditableField";
import EditableTextArea from "@components/forms/EditableTextArea";
import SeoFields from "@components/forms/SeoFields";
import OrderSelector from "@components/forms/OrderSelector";
import ItemSelector from "@components/forms/ItemSelector";
import { useAutoGenFields, slugify } from "@hooks/useAutoGenFields";
import {
    type SectionFormTypes,
    initialSectionForm,
    useSectionForm,
} from "@entities/models/section";

interface Props {
    manager: ReturnType<typeof useSectionForm>;
    onSave: () => void;
    editingIndex: number | null;
}

const SectionForm = forwardRef<HTMLFormElement, Props>(function SectionForm(
    { manager, onSave, editingIndex },
    ref
) {
    const {
        form,
        extras: { posts, sections },
        submit,
        handleChange,
        setForm,
        setMode,
        mode,
        saving,
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

    function handleFieldChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        if (name === "title" || name === "description") {
            handleSourceFocus(name);
        }
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
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await submit();
        setMode("create");
        setForm(initialSectionForm);
        onSave();
    }

    return (
        <form ref={ref} onSubmit={handleSubmit} className="space-y-2 mb-6">
            <EditableField
                name="title"
                label="Titre"
                value={form.title}
                onChange={handleFieldChange}
                readOnly={false}
            />
            <EditableField
                name="slug"
                label="Slug"
                value={form.slug}
                onChange={handleFieldChange}
                readOnly={false}
            />
            <EditableTextArea
                name="description"
                label="Description"
                value={form.description ?? ""}
                onChange={handleFieldChange}
                readOnly={false}
            />
            <OrderSelector
                sections={sections}
                currentIndex={editingIndex ?? -1}
                value={form.order ?? 1}
                onReorder={(_: number, newOrder: number) => handleChange("order", newOrder)}
            />
            <SeoFields
                seo={{
                    title: form.seo.title ?? "",
                    description: form.seo.description ?? "",
                    image: form.seo.image ?? "",
                }}
                onChange={handleFieldChange}
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
                {mode === "edit" ? "Mettre à jour" : "Créer"}
            </button>
        </form>
    );
});

export default SectionForm;

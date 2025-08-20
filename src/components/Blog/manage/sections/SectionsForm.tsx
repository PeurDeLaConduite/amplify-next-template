// src/components/Blog/manage/sections/SectionForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent, type FormEvent } from "react";
import EditableField from "@components/forms/EditableField";
import EditableTextArea from "@components/forms/EditableTextArea";
import SeoFields from "@components/forms/SeoFields";
import OrderSelector from "@components/forms/OrderSelector";
import ItemSelector from "@components/forms/ItemSelector";
import { SaveButton } from "@components/buttons";
import { useAutoGenFields, slugify } from "@hooks/useAutoGenFields";
import {
    type SectionFormTypes,
    initialSectionForm,
    useSectionManager,
} from "@entities/models/section";

interface Props {
    manager: ReturnType<typeof useSectionManager>;
    onSave: () => void;
    editingId: string | null;
}

const SectionForm = forwardRef<HTMLFormElement, Props>(function SectionForm(
    { manager, onSave, editingId },
    ref
) {
    const {
        form,
        entities: sections,
        extras: { posts },
        updateField,
        patchForm,
        editingId: currentEditingId,
        cancelEdit,
        createEntity,
        updateEntity,
    } = manager;

    const { handleSourceFocus, handleManualEdit } = useAutoGenFields({
        configs: [
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.slug ?? "",
                target: "slug",
                setter: (v) => updateField("slug", slugify(v ?? "")),
                transform: slugify,
            },
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.seo.title ?? "",
                target: "seo.title",
                setter: (v) => updateField("seo", { ...form.seo, title: v ?? "" }),
            },
            {
                editingKey: "description",
                source: form.description ?? "",
                current: form.seo.description ?? "",
                target: "seo.description",
                setter: (v) => updateField("seo", { ...form.seo, description: v ?? "" }),
            },
        ],
    });

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "title" || name === "description") handleSourceFocus(name);
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1] as keyof SectionFormTypes["seo"];
            updateField("seo", { ...form.seo, [key]: value });
            handleManualEdit(`seo.${key}`);
        } else if (name === "slug") {
            updateField("slug", slugify(value));
            handleManualEdit("slug");
        } else {
            updateField(name as keyof SectionFormTypes, value as never);
        }
    };

    const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (currentEditingId) {
            await updateEntity(currentEditingId, form);
        } else {
            await createEntity(form);
        }
        cancelEdit();
        patchForm(initialSectionForm);
        onSave();
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} className="mb-6 grid gap-2">
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
                onReorder={(_, newOrder) => updateField("order", newOrder)}
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
                onChange={(postIds) => patchForm({ postIds })}
                label="Articles associés :"
                getLabel={(post) => post.title}
            />
            <div className="flex space-x-2">
                <SaveButton
                    onClick={() => void handleSubmit()}
                    label={currentEditingId ? "Mettre à jour" : "Créer"}
                />
            </div>
        </form>
    );
});

export default SectionForm;

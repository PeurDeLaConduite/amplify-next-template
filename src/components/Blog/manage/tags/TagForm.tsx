// Blog / manage / tags / TagForm.tsx;
"use client";

import React, { forwardRef, type ChangeEvent } from "react";
import BlogFormShell from "@components/Blog/manage/BlogFormShell";
import { useTagForm } from "@entities/models/tag/hooks";
import { initialTagForm } from "@entities/models/tag/form";
import type { TagFormType, TagType } from "@entities/models/tag/types";
import { EditableField } from "@components/ui/Form";

type UseTagFormReturn = ReturnType<typeof useTagForm>;

interface Props {
    tagFormManager: UseTagFormReturn;
    onSaveSuccess: () => void;
    onCancel: () => void;
    tags: TagType[];
    editingId: string | null;
}

const TagForm = forwardRef<HTMLFormElement, Props>(function TagForm(
    { tagFormManager, onSaveSuccess, onCancel },
    ref
) {
    const { form, setFieldValue } = tagFormManager;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Pour rester symétrique à PostForm : on passe par setFieldValue
        setFieldValue(name as keyof TagFormType, value as never);
    };

    return (
        <BlogFormShell<TagFormType>
            ref={ref}
            blogFormManager={tagFormManager}
            initialForm={initialTagForm}
            onSaveSuccess={onSaveSuccess}
            onCancel={onCancel}
            submitLabel={{ create: "Ajouter", edit: "Mettre à jour" }}
        >
            <EditableField
                name="name"
                label="Nom du tag"
                value={form.name ?? ""}
                onChange={onChange}
                readOnly={false}
                autoComplete="off"
            />
        </BlogFormShell>
    );
});

export default TagForm;

"use client";

import React, { forwardRef } from "react";
import BlogFormShell, { type BlogFormManager } from "@components/Blog/manage/BlogFormShell";
import { useTagForm } from "@entities/models/tag/hooks";
import { initialTagForm } from "@entities/models/tag/form";
import type { TagFormType } from "@entities/models/tag/types";

type UseTagFormReturn = ReturnType<typeof useTagForm>;

interface Props {
    tagFormManager: UseTagFormReturn;
    onSaveSuccess: () => void;
}

const TagForm = forwardRef<HTMLFormElement, Props>(function TagForm(
    { tagFormManager, onSaveSuccess },
    ref
) {
    const { form, setForm } = tagFormManager;
    const normalizedManager = tagFormManager as BlogFormManager<TagFormType>;

    return (
        <BlogFormShell
            ref={ref}
            blogFormManager={normalizedManager}
            initialForm={initialTagForm}
            onSaveSuccess={onSaveSuccess}
            submitLabel={{ create: "Ajouter", edit: "Mettre à jour" }}
            className="!grid-cols-[1fr_auto]"
        >
            <input
                type="text"
                value={form.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nom du tag"
                className="border rounded p-2 bg-white"
            />
        </BlogFormShell>
    );
});

export default TagForm;

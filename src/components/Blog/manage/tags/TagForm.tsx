"use client";

import React, { forwardRef } from "react";
import EntityFormShell, { type EntityFormManager } from "@components/Blog/manage/EntityFormShell";
import { useTagForm } from "@entities/models/tag/hooks";
import { initialTagForm } from "@entities/models/tag/form";
import type { TagFormType } from "@entities/models/tag/types";

type UseTagFormReturn = ReturnType<typeof useTagForm>;

interface Props {
    manager: UseTagFormReturn;
    afterSave: () => void;
}

const TagForm = forwardRef<HTMLFormElement, Props>(function TagForm({ manager, afterSave }, ref) {
    const { form, setForm } = manager;
    const normalizedManager = manager as EntityFormManager<TagFormType>;

    return (
        <EntityFormShell
            ref={ref}
            manager={normalizedManager}
            initialForm={initialTagForm}
            afterSave={afterSave}
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
        </EntityFormShell>
    );
});

export default TagForm;

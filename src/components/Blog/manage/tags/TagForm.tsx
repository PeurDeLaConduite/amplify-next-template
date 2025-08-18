"use client";

import React, { forwardRef } from "react";
import EntityFormShell from "@components/Blog/manage/EntityFormShell";
import { useTagForm } from "@entities/models/tag/hooks";

type UseTagFormReturn = ReturnType<typeof useTagForm>;

interface Props {
    manager: UseTagFormReturn;
    onSave: () => void;
}

const TagForm = forwardRef<HTMLFormElement, Props>(function TagForm({ manager, onSave }, ref) {
    const { form, setForm } = manager;

    // Normalise: certains hooks ont `save` au lieu de `submit`
    const normalizedManager = {
        ...manager,
        submit: (manager as any).submit ?? (manager as any).save,
    };

    return (
        <EntityFormShell
            ref={ref}
            manager={normalizedManager as any}
            initialForm={{ name: "" } as any}
            onSave={onSave}
            submitLabel={{ create: "Ajouter", edit: "Mettre à jour" }}
            className="!grid-cols-[1fr_auto]"
        >
            <input
                type="text"
                value={(form as any).name ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f: any) => ({ ...f, name: e.target.value }))
                }
                placeholder="Nom du tag"
                className="border rounded p-2 bg-white"
            />
        </EntityFormShell>
    );
});

export default TagForm;

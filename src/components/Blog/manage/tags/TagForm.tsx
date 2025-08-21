"use client";

import React, { forwardRef } from "react";
import EntityFormShell, { type EntityFormManager } from "@components/Blog/manage/EntityFormShell";
import { initialTagForm } from "@entities/models/tag/form";
import { useTagManager } from "@entities/models/tag";
import type { TagFormType } from "@entities/models/tag/types";

interface Props {
    manager: ReturnType<typeof useTagManager>;
    onSave: () => void;
}

const TagForm = forwardRef<HTMLFormElement, Props>(function TagForm({ manager, onSave }, ref) {
    const { state, patchForm, updateField, createEntity, updateEntity, cancelEdit, refresh } =
        manager;
    const { form, editingId } = state;

    const submit = async () => {
        if (editingId) {
            await updateEntity(editingId, form);
        } else {
            await createEntity(form);
        }
        await refresh();
    };

    const setForm: React.Dispatch<React.SetStateAction<TagFormType>> = (updater) => {
        if (typeof updater === "function") {
            patchForm(updater(form));
        } else {
            patchForm(updater);
        }
    };

    const setMode: React.Dispatch<React.SetStateAction<"create" | "edit">> = (mode) => {
        if (mode === "create") {
            cancelEdit();
        }
    };

    const normalizedManager: EntityFormManager<TagFormType> = {
        form,
        submit,
        setForm,
        setMode,
        mode: editingId ? "edit" : "create",
        saving: manager.savingCreate || manager.savingUpdate,
        message: null,
    };

    return (
        <EntityFormShell
            ref={ref}
            manager={normalizedManager}
            initialForm={initialTagForm}
            onSave={onSave}
            className="!grid-cols-[1fr_auto]"
        >
            <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nom du tag"
                className="border rounded p-2 bg-white"
            />
        </EntityFormShell>
    );
});

export default TagForm;

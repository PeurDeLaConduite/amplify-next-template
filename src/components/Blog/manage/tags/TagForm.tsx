"use client";

import React, { forwardRef, type FormEvent } from "react";
import { SaveButton, CancelButton } from "@components/buttons";
import { initialTagForm } from "@entities/models/tag/form";
import { useTagManager } from "@entities/models/tag";

interface Props {
    manager: ReturnType<typeof useTagManager>;
    onSave: () => void;
}

const TagForm = forwardRef<HTMLFormElement, Props>(function TagForm({ manager, onSave }, ref) {
    const { state, patchForm, updateField, createEntity, updateEntity, cancelEdit, refresh } =
        manager;
    const { form, editingId } = state;

    const handleSubmit = async (e?: FormEvent) => {
        e?.preventDefault();
        if (editingId) {
            await updateEntity(editingId, form);
        } else {
            await createEntity(form);
        }
        await refresh();
        patchForm(initialTagForm);
        cancelEdit();
        onSave();
    };

    const handleCancel = () => {
        patchForm(initialTagForm);
        cancelEdit();
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} className="grid gap-2 !grid-cols-[1fr_auto]">
            <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nom du tag"
                className="border rounded p-2 bg-white"
            />
            <div className="flex space-x-2">
                <SaveButton
                    onClick={() => void handleSubmit()}
                    label={editingId ? "Mettre à jour" : "Ajouter"}
                />
                <CancelButton onClick={handleCancel} label="Annuler" />
            </div>
        </form>
    );
});

export default TagForm;

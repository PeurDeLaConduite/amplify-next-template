import React from "react";
import { AddButton, EditButton, DeleteButton, SaveButton, CancelButton } from "@components/buttons";

export default function TagCrudManager({ tags, modelForm, onEdit, onCancel, onDelete, fetchAll }) {
    const { form, mode, setForm, submit } = modelForm;

    async function handleSubmit() {
        await submit();
        await fetchAll();
        onCancel();
    }

    return (
        <fieldset className="border p-4 rounded-md mt-4">
            <legend className="text-md font-medium text-gray-700">
                Tags : Création / Édition / Suppression
            </legend>
            <div className="flex flex-wrap gap-2 items-center mb-2">
                <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nom du tag"
                    className="border rounded p-2 flex-1 bg-white"
                />

                {mode === "create" ? (
                    <AddButton label="Ajouter" onClick={handleSubmit} />
                ) : (
                    <>
                        <SaveButton label="Enregistrer" onClick={handleSubmit} />
                        <CancelButton label="Annuler" onClick={onCancel} />
                    </>
                )}
            </div>
            <ul className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                    <li
                        key={tag.id}
                        className="flex gap-2 items-center px-4 py-1 bg-blue-50 border border-blue-100 rounded-lg"
                    >
                        <span className="font-semibold text-blue-700 px-2">{tag.name}</span>
                        <EditButton label="" onClick={() => onEdit(tag.id)} color="#1976d2" />
                        <DeleteButton label="" onClick={() => onDelete(tag.id)} />
                    </li>
                ))}
            </ul>
        </fieldset>
    );
}

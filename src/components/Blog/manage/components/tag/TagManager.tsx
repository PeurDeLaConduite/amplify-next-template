"use client";

import React from "react";
import { AddButton } from "@components/buttons";
import GenericList from "@components/Blog/manage/GenericList";
import { byAlpha } from "@components/Blog/manage/sorters";
import type { UseTagFormReturn } from "@entities/models/tag/hooks";
import type { TagType } from "@entities/models/tag/types";

interface Props {
    manager: UseTagFormReturn;
}

export default function TagManager({ manager }: Props) {
    const {
        form,
        setForm,
        mode,
        extras: { tags, index },
        save,
        edit,
        cancel,
        remove,
    } = manager;

    return (
        <fieldset className="border p-4 rounded-md mt-4">
            <legend className="text-md font-medium text-gray-700">
                Tags : Création / Édition / Suppression
            </legend>
            <div className="flex flex-wrap gap-2 items-center mb-2">
                <input
                    type="text"
                    value={form.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Nom du tag"
                    className="border rounded p-2 flex-1 bg-white"
                />
                {mode === "create" && <AddButton label="Ajouter" onClick={save} />}
            </div>
            <GenericList<TagType>
                items={tags}
                editingIndex={index}
                getKey={(t) => t.id}
                renderContent={(t) => (
                    <span className="font-semibold text-blue-700 px-2">{t.name}</span>
                )}
                sortBy={byAlpha((t) => t.name)}
                onEdit={edit}
                onSave={save}
                onCancel={cancel}
                onDelete={remove}
            />
        </fieldset>
    );
}

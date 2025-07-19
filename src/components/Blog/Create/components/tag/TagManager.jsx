import React from "react";
import {
    AddButton,
    EditButton,
    DeleteButton,
    SaveButton,
    CancelButton,
} from "@/src/components/buttons";

export default function TagCrudManager({
    tags,
    newTag,
    editTagId,
    editTagName,
    setNewTag,
    setEditTagId,
    setEditTagName,
    onCreate,
    onUpdate,
    onDelete,
}) {
    return (
        <fieldset className="border p-4 rounded-md mt-4">
            <legend className="text-md font-medium text-gray-700">
                Tags : Création / Édition / Suppression
            </legend>
            <div className="flex flex-wrap gap-2 items-center mb-2">
                <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag"
                    className="border rounded p-2 flex-1 bg-white"
                />

                <AddButton label="Ajouter" onClick={onCreate} />
            </div>
            <ul className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) =>
                    editTagId === tag.id ? (
                        <li key={tag.id} className="flex gap-2 items-center">
                            <input
                                value={editTagName}
                                onChange={(e) => setEditTagName(e.target.value)}
                                className="border rounded p-2"
                                autoFocus
                            />
                            <SaveButton label="Enregistrer" onClick={onUpdate} />
                            <CancelButton label="Annuler" onClick={() => setEditTagId(null)} />
                        </li>
                    ) : (
                        <li
                            key={tag.id}
                            className="flex gap-2 items-center px-4 py-1 bg-blue-50 border border-blue-100 rounded-lg"
                        >
                            <span className="font-semibold text-blue-700 px-2">{tag.name}</span>
                            <EditButton
                                label=""
                                onClick={() => {
                                    setEditTagId(tag.id);
                                    setEditTagName(tag.name);
                                }}
                                color="#1976d2"
                            />
                            <DeleteButton label="" onClick={() => onDelete(tag.id)} />
                        </li>
                    )
                )}
            </ul>
        </fieldset>
    );
}

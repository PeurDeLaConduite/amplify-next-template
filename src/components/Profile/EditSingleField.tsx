import { SaveButton, BackButton } from "@/src/components/buttons/Buttons";
import React from "react";
import type { Profile } from "./utilsProfile";

type Props<K extends keyof Profile = keyof Profile> = {
    editModeField: { field: K; value: string };
    setEditModeField: React.Dispatch<React.SetStateAction<{ field: K; value: string } | null>>;
    saveSingleField: () => void;
    label: (field: K) => string;
};
export default function EditSingleField({
    editModeField,
    setEditModeField,
    saveSingleField,
    label,
}: Props) {
    return (
        <fieldset className="my-6 p-4 border rounded-md bg-white shadow-sm max-w-md mx-auto">
            <legend className="font-semibold text-lg mb-4 block">
                Modifier mon {label(editModeField.field).toLowerCase()} :
            </legend>

            <label htmlFor="edit-field" className="sr-only">
                {label(editModeField.field)}
            </label>
            <input
                id="edit-field"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editModeField.value}
                placeholder={label(editModeField.field)}
                title={label(editModeField.field)}
                onChange={(e) =>
                    setEditModeField((prev) => (prev ? { ...prev, value: e.target.value } : null))
                }
            />

            <div className="flex justify-between mt-5 gap-10">
                <SaveButton onClick={saveSingleField} label="Sauvegarder" className="flex-1 mr-2" />
                <BackButton
                    onClick={() => setEditModeField(null)}
                    label="Retour"
                    className="flex-1 ml-2"
                />
            </div>
        </fieldset>
    );
}

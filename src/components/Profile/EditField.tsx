import { SaveButton, BackButton } from "@/src/components/buttons/Buttons";
import React from "react";

export type EditFieldProps<T extends Record<string, string>> = {
    editModeField: { field: keyof T; value: string };
    setEditModeField: React.Dispatch<
        React.SetStateAction<{ field: keyof T; value: string } | null>
    >;
    saveSingleField: () => void;
    label: (field: keyof T) => string;
};

export default function EditField<T extends Record<string, string>>({
    editModeField,
    setEditModeField,
    saveSingleField,
    label,
}: EditFieldProps<T>) {
    const { field, value } = editModeField;

    return (
        <fieldset className="my-6 p-4 border rounded-md bg-white shadow-sm max-w-md mx-auto">
            <legend className="font-semibold text-lg mb-4">
                Modifier mon {label(field).toLowerCase()} :
            </legend>

            <label htmlFor="edit-field" className="sr-only">
                {label(field)}
            </label>
            <input
                id="edit-field"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={value}
                placeholder={label(field)}
                title={label(field)}
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

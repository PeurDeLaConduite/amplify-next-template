//EditSingleFieldUserName.tsx;
import React from "react";
import { SaveButton, BackButton } from "@/src/components/buttons/Buttons";

/** T = shape du modèle manipulé (UserProfileInput | UserNameData | …) */
// type SingleField<T> = {
//     [K in keyof T]: { field: K; value: NonNullable<T[K]> };
// }[keyof T];
type Stringish = string | null | undefined;
type Props<T extends Record<string, Stringish>> = {
    editModeField: {
        [K in keyof T]: { field: K; value: NonNullable<T[K]> };
    }[keyof T];
    setEditModeField: React.Dispatch<
        React.SetStateAction<
            { [K in keyof T]: { field: K; value: NonNullable<T[K]> } }[keyof T] | null
        >
    >;
    saveSingleField: () => void;
    label: (field: keyof T) => string;
};

export default function EditSingleFieldUserName<T extends Record<string, string>>({
    editModeField,
    setEditModeField,
    saveSingleField,
    label,
}: Props<T>) {
    const { field, value } = editModeField;

    return (
        <fieldset className="my-6 p-4 border rounded-md bg-white shadow-sm max-w-md mx-auto">
            <legend className="font-semibold text-lg mb-4">
                Modifier mon {label(field).toLowerCase()} :
            </legend>

            <input
                id="edit-field"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={value}
                placeholder={label(field)}
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

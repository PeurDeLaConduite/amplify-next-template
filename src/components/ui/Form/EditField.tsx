import { UpdateButton, BackButton } from "@components/ui/Button";
import React from "react";
import type { FieldKey } from "@entities/core/hooks";
import { autocompleteFor } from "@utils/autocomplete";

type EditFieldProps<T extends Record<string, unknown>> = {
    editModeField: { field: FieldKey<T>; value: string };
    setEditModeField: React.Dispatch<
        React.SetStateAction<{ field: FieldKey<T>; value: string } | null>
    >;
    saveField: () => void;
    labels: (field: FieldKey<T>) => string;
    /** Permet d'overrider manuellement si besoin (ex: "new-password") */
    autoComplete?: string;
};

export default function EditField<T extends Record<string, unknown>>({
    editModeField,
    setEditModeField,
    saveField,
    labels,
    autoComplete, // ← on l’utilise pour override si fourni
}: EditFieldProps<T>) {
    const { field, value } = editModeField;
    const inputId = React.useId();

    const ac = autocompleteFor<T>(field, autoComplete);

    return (
        <fieldset className="my-6 p-4 border rounded-md bg-white shadow-sm max-w-md mx-auto">
            <legend className="font-semibold text-lg mb-4">
                Modifier mon {labels(field).toLowerCase()} :
            </legend>

            <label htmlFor={inputId} className="sr-only">
                {labels(field)}
            </label>
            <input
                id={inputId}
                name={String(field)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={value}
                placeholder={labels(field)}
                title={labels(field)}
                autoComplete={ac}
                onChange={(e) =>
                    setEditModeField((prev) => (prev ? { ...prev, value: e.target.value } : null))
                }
            />

            <div className="flex justify-between mt-5 gap-10">
                <UpdateButton
                    onUpdate={saveField}
                    label="Sauvegarder"
                    className="flex-1 mr-2"
                    size="medium"
                />
                <BackButton
                    onBack={() => setEditModeField(null)}
                    label="Retour"
                    className="flex-1 ml-2"
                    size="medium"
                />
            </div>
        </fieldset>
    );
}

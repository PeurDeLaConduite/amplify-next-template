// src/components/shared/EntityForm.tsx
"use client";
import React, { type ChangeEvent, FormEvent } from "react";
import { SaveButton, AddButton, CancelButton } from "../buttons/Buttons";
import { type FieldKey } from "@/src/hooks/useEntityManager";

type Props<T extends Record<string, string>> = {
    formData: Partial<T>;
    fields: FieldKey<T>[];
    label: (field: FieldKey<T>) => string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
    isEdit: boolean;
    onCancel: () => void;
    requiredFields: FieldKey<T>[];
};

export default function EntityForm<T extends Record<string, string>>({
    formData,
    fields,
    label,
    handleChange,
    handleSubmit,
    isEdit,
    onCancel,
    requiredFields,
}: Props<T>) {
    return (
        <form
            onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="space-y-5 p-6 bg-white border rounded-md shadow-sm max-w-md mx-auto"
        >
            {fields.map((field) => (
                <div key={String(field)}>
                    <label htmlFor={String(field)} className="block mb-1 font-medium">
                        {label(field)}
                    </label>
                    <input
                        id={String(field)}
                        name={String(field)}
                        placeholder={label(field)}
                        value={formData[field] ?? ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required={requiredFields.includes(field)}
                    />
                </div>
            ))}

            <div className="flex justify-end gap-2 pt-2">
                {isEdit ? (
                    <>
                        <SaveButton
                            onClick={handleSubmit}
                            label="Enregistrer"
                            className="min-w-[120px]"
                        />
                        <CancelButton
                            onClick={onCancel}
                            label="Annuler"
                            className="min-w-[120px]"
                        />
                    </>
                ) : (
                    <AddButton onClick={handleSubmit} label="Créer" className="min-w-[120px]" />
                )}
            </div>
        </form>
    );
}

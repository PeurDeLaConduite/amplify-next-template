// src/components/ui/form/EntityForm.tsx
"use client";
import React, { type FormEvent } from "react";
import { SaveButton, AddButton, CancelButton } from "@components/ui/Button";
import { type FieldKey } from "@entities/core/hooks";

type Props<T extends Record<string, unknown>> = {
    formData: Partial<T>;
    fields: FieldKey<T>[];
    labels: (field: FieldKey<T>) => string;
    handleChange: (field: FieldKey<T>, value: unknown) => void;
    handleSubmit: () => void;
    isEdit: boolean;
    onCancel: () => void;
    requiredFields: FieldKey<T>[];
};

export default function EntityForm<T extends Record<string, unknown>>({
    formData,
    fields,
    labels,
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
                        {labels(field)}
                    </label>
                    <input
                        id={String(field)}
                        name={String(field)}
                        placeholder={labels(field)}
                        value={String(formData[field] ?? "")}
                        onChange={(e) => handleChange(field, e.target.value)}
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
                            size="medium"
                        />
                        <CancelButton
                            onClick={onCancel}
                            label="Annuler"
                            className="min-w-[120px]"
                            size="medium"
                        />
                    </>
                ) : (
                    <AddButton
                        onClick={handleSubmit}
                        label="Créer"
                        className="min-w-[120px]"
                        size="medium"
                    />
                )}
            </div>
        </form>
    );
}

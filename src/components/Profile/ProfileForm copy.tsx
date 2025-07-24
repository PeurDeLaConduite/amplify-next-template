// src/components/forms/ProfileForm.tsx
"use client";

import React, { type ChangeEvent, FormEvent } from "react";
import { SaveButton, AddButton, CancelButton } from "../buttons/Buttons";
import type { MinimalProfile } from "./utilsProfile";

type Props = {
    /** Valeurs actuelles du formulaire (partielles possibles) */
    formData: Partial<MinimalProfile>;
    /** Liste des champs à afficher, ex. ['firstName','city'] ou ['userName'] */
    fields: (keyof MinimalProfile)[];
    /** Pour obtenir le libellé d'un champ */
    label: (field: keyof MinimalProfile) => string;
    /** Callback quand l'utilisateur saisit */
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Callback pour valider le formulaire */
    handleSubmit: () => void;
    /** true = édition existante (boutons Enregistrer/Annuler), false = création (bouton Créer) */
    isEdit: boolean;
    /** Annule l'édition (remet les valeurs d'origine) */
    onCancel: () => void;
};

export default function ProfileForm({
    formData,
    fields,
    label,
    handleChange,
    handleSubmit,
    isEdit,
    onCancel,
}: Props) {
    return (
        <form
            onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="space-y-5 p-6 bg-white border rounded-md shadow-sm max-w-md mx-auto"
        >
            {fields.map((field) => (
                <div key={field}>
                    <label htmlFor={field} className="block mb-1 font-medium">
                        {label(field)}
                    </label>
                    <input
                        id={field}
                        name={field}
                        placeholder={label(field)}
                        value={formData[field] ?? ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required={["userName", "firstName", "familyName"].includes(field)}
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

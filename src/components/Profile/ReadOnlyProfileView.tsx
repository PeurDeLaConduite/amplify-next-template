// src/components/ReadOnlyProfileView.tsx
import React from "react";
import { EditButton, DeleteButton } from "@/src/components/buttons/Buttons";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import type { MinimalProfile } from "./utilsProfile";

function formatPhoneNumber(number?: string): string {
    if (!number) return "";
    return number.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

type Props = {
    /** Données du profil (peuvent être partielles) */
    profile: Partial<MinimalProfile>;
    /** Champ(s) à afficher, ex. ["userName"] ou ["firstName","city"] */
    fields: (keyof MinimalProfile)[];
    /** Fonction pour obtenir le libellé d'un champ */
    label: (field: keyof MinimalProfile) => string;
    /** Callback quand on clique sur le bouton Éditer */
    onEditField: (edit: { field: keyof MinimalProfile; value: string }) => void;
    /** Callback quand on clique sur le bouton Supprimer */
    onClearField: (field: keyof MinimalProfile) => void;
    /** Titre de la section (défaut: "Gestion du profil") */
    title?: string;
};

export default function ReadOnlyProfileView({
    profile,
    fields,
    label,
    onEditField,
    onClearField,
    title = "Gestion du profil",
}: Props) {
    const getIcon = (field: keyof MinimalProfile) => {
        switch (field) {
            case "phoneNumber":
                return <PhoneIcon fontSize="small" className="text-gray-800" />;
            case "firstName":
            case "familyName":
                return <PersonIcon fontSize="small" className="text-gray-800" />;
            case "address":
            case "postalCode":
            case "city":
            case "country":
                return <HomeIcon fontSize="small" className="text-gray-800" />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-6 bg-violet-100 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
            <div className="space-y-6">
                {fields.map((field) => {
                    const value = profile[field] ?? "";
                    return (
                        <div key={field} className="bg-white rounded-lg shadow-md px-4 py-5">
                            {/* Label + actions */}
                            <div className="flex items-center justify-between mb-2">
                                <label
                                    className="text-gray-800 font-semibold flex items-center gap-2 select-none"
                                    title={`Modifier ${label(field)}`}
                                >
                                    {getIcon(field)} <span>{label(field)}</span>
                                </label>
                                <div className="flex gap-2">
                                    <EditButton
                                        onClick={() => onEditField({ field, value: String(value) })}
                                        className="!w-8 !h-8"
                                        color="#1976d2"
                                    />
                                    {value && (
                                        <DeleteButton
                                            onClick={() => onClearField(field)}
                                            className="!w-8 !h-8"
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Valeur ou placeholder */}
                            <div>
                                {field === "phoneNumber" && value ? (
                                    <a
                                        href={`tel:${value}`}
                                        className="text-base text-gray-900 hover:underline"
                                    >
                                        {formatPhoneNumber(value)}
                                    </a>
                                ) : value ? (
                                    <p className="text-base text-gray-900 break-words">{value}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        {field === "phoneNumber"
                                            ? "Numéro non renseigné"
                                            : "Information non disponible"}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

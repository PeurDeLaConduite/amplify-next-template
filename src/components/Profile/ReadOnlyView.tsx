import React from "react";
import { EditButton, DeleteButton } from "@/src/components/buttons/Buttons";

export type ReadOnlyViewProps<T> = {
    /** Données partiellement définies */
    data: Partial<T>;
    /** Champs à afficher */
    fields: (keyof T)[];
    /** Libellé affiché pour chaque champ */
    label: (field: keyof T) => string;
    /** Callback sur le bouton d'édition */
    onEditField: (edit: { field: keyof T; value: string }) => void;
    /** Callback sur le bouton de suppression */
    onClearField?: (field: keyof T) => void;
    /** Titre de la section */
    title?: string;
    /** Permet d'injecter des icônes spécifiques */
    renderIcon?: (field: keyof T) => React.ReactNode;
    /** Permet d'injecter des boutons supplémentaires */
    extraButtons?: (field: keyof T, value: string) => React.ReactNode;
    /** Rendu personnalisé de la valeur */
    renderValue?: (field: keyof T, value: string) => React.ReactNode;
};

export default function ReadOnlyView<T>({
    data,
    fields,
    label,
    onEditField,
    onClearField,
    title = "Gestion",
    renderIcon,
    extraButtons,
    renderValue,
}: ReadOnlyViewProps<T>) {
    return (
        <div className="max-w-3xl mx-auto px-4 py-6 bg-violet-100 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
            <div className="space-y-6">
                {fields.map((field) => {
                    const raw = data[field];
                    const value = raw === undefined || raw === null ? "" : String(raw);
                    return (
                        <div
                            key={String(field)}
                            className="bg-white rounded-lg shadow-md px-4 py-5"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-gray-800 font-semibold flex items-center gap-2 select-none">
                                    {renderIcon?.(field)} <span>{label(field)}</span>
                                </label>
                                <div className="flex gap-2">
                                    {extraButtons?.(field, value)}
                                    <EditButton
                                        onClick={() => onEditField({ field, value })}
                                        className="!w-8 !h-8"
                                        color="#1976d2"
                                    />
                                    {onClearField && value && (
                                        <DeleteButton
                                            onClick={() => onClearField(field)}
                                            className="!w-8 !h-8"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                {renderValue ? (
                                    renderValue(field, value)
                                ) : value ? (
                                    <p className="text-base text-gray-900 break-words">{value}</p>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        Information non disponible
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

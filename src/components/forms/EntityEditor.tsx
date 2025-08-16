"use client";
import React, { useState } from "react";
import type { FieldKey } from "@entities/core/hooks";
import type { EditMode } from "@entities/core/types";
import ReadOnlyView from "./ReadOnlyView";
import EditField from "./EditField";
import EntityForm from "./EntityForm";
import { DeleteButton } from "@components/buttons";

export type EntityEditorProps<T extends Record<string, unknown>> = {
    /** Titre de la section */
    title: string;
    /** Champs requis pour le formulaire */
    requiredFields?: FieldKey<T>[];
    /** Rendu personnalisé des icônes */
    renderIcon?: (field: FieldKey<T>) => React.ReactNode;
    /** Rendu personnalisé des valeurs */
    renderValue?: (field: FieldKey<T>, value: string) => React.ReactNode;
    /** Boutons supplémentaires pour chaque champ */
    extraButtons?: (field: FieldKey<T>, value: string) => React.ReactNode;
    /** Libellé du bouton de suppression de l'entité */
    deleteLabel?: string;
    /** Classe optionnelle pour la section */
    className?: string;
    /** Personnalisation de l'effacement d'un champ */
    onClearField?: (field: FieldKey<T>, clear: (field: FieldKey<T>) => Promise<void>) => void;
    /** Données du formulaire */
    form: T;
    /** Mode du formulaire (création/édition) */
    mode: EditMode;
    /** Indicateur de modification */
    dirty: boolean;
    /** Gestion des changements */
    handleChange: (field: FieldKey<T>, value: unknown) => void;
    /** Soumission du formulaire */
    submit: () => Promise<void>;
    /** Réinitialisation du formulaire */
    reset: () => void;
    /** Permet de remplacer le formulaire */
    setForm: React.Dispatch<React.SetStateAction<T>>;
    /** Champs gérés */
    fields: FieldKey<T>[];
    /** Libellés des champs */
    labels: (field: FieldKey<T>) => string;
    /** Sauvegarde d'un champ individuel */
    saveField?: (field: FieldKey<T>, value: string) => Promise<void>;
    /** Effacement d'un champ individuel */
    clearField?: (field: FieldKey<T>) => Promise<void>;
    /** Suppression de l'entité */
    deleteEntity?: () => Promise<void>;
    /** Indique si une opération est en cours */
    loading?: boolean;
};

export default function EntityEditor<T extends Record<string, unknown>>(
    props: EntityEditorProps<T>
) {
    const {
        title,
        requiredFields = [],
        renderIcon,
        renderValue,
        extraButtons,
        deleteLabel,
        className,
        onClearField,
        form,
        mode,
        handleChange,
        submit,
        reset,
        fields,
        labels,
        saveField,
        clearField,
        deleteEntity,
        loading = false,
    } = props;
    const [editModeField, setEditModeField] = useState<{
        field: FieldKey<T>;
        value: string;
    } | null>(null);

    const handleCancel = () => {
        reset();
    };

    const handleClearField = (field: FieldKey<T>) => {
        if (onClearField) {
            onClearField(field, async (f) => {
                await clearField?.(f);
            });
        } else {
            void clearField?.(field);
        }
    };

    if (loading) {
        return (
            <section
                className={`w-full max-w-md mx-auto px-4 py-6 bg-white shadow rounded-lg mb-8 ${
                    className ?? ""
                }`}
            >
                <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
                <p className="text-center text-gray-500">Chargement…</p>
            </section>
        );
    }

    return (
        <section
            className={`w-full max-w-md mx-auto px-4 py-6 bg-white shadow rounded-lg mb-8 ${
                className ?? ""
            }`}
        >
            <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>

            {mode === "edit" && !editModeField && (
                <ReadOnlyView<T>
                    title={title}
                    fields={fields}
                    data={form}
                    labels={labels}
                    renderIcon={renderIcon}
                    renderValue={renderValue}
                    extraButtons={extraButtons}
                    onEditField={setEditModeField}
                    onClearField={handleClearField}
                />
            )}

            {editModeField && (
                <EditField<T>
                    editModeField={editModeField}
                    setEditModeField={setEditModeField}
                    saveSingleField={() =>
                        saveField
                            ? saveField(editModeField.field, editModeField.value).then(() =>
                                  setEditModeField(null)
                              )
                            : Promise.resolve()
                    }
                    labels={labels}
                />
            )}

            {mode === "create" && !editModeField && (
                <EntityForm<T>
                    formData={form}
                    fields={fields}
                    labels={labels}
                    handleChange={handleChange}
                    handleSubmit={() => submit().then(() => void 0)}
                    isEdit={false}
                    onCancel={handleCancel}
                    requiredFields={requiredFields}
                />
            )}

            {mode === "edit" && !editModeField && deleteLabel && (
                <div className="flex items-center justify-center mt-8">
                    <DeleteButton
                        onClick={() => {
                            void deleteEntity?.();
                        }}
                        label={deleteLabel}
                    />
                </div>
            )}
        </section>
    );
}

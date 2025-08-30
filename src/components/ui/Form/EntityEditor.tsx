"use client";
import React, { useState } from "react";
import type { FieldKey, FormMode } from "@entities/core/hooks";
import ReadOnlyView from "./ReadOnlyView";
import EditField from "./EditField";
import EntityForm from "./EntityForm";
import { DeleteButton } from "@components/ui/Button";

type EntityEditorProps<T extends Record<string, unknown>> = {
    /** Titre de la section */
    title: string;
    /** Champs requis pour le formulaire */
    requiredFields?: FieldKey<T>[];
    /** Rendu personnalisé des icônes */
    labelIcon?: (field: FieldKey<T>) => React.ReactNode;
    /** Rendu personnalisé des valeurs */
    renderValue?: (field: FieldKey<T>, value: string) => React.ReactNode;
    /** Boutons supplémentaires pour chaque champ */
    extraButtons?: (field: FieldKey<T>, value: string) => React.ReactNode;
    /** Libellé du bouton de suppression de l'entité */
    deleteButtonLabel?: string;
    /** Classe optionnelle pour la section */
    className?: string;
    /** Personnalisation de l'effacement d'un champ */
    onClearField?: (field: FieldKey<T>, clear: (field: FieldKey<T>) => Promise<void>) => void;
    /** Données du formulaire */
    form: T;
    /** Mode du formulaire (création/édition) */
    mode: FormMode;
    /** Indicateur de modification */
    dirty: boolean;
    /** Gestion des changements */
    setFieldValue: (field: FieldKey<T>, value: unknown) => void;
    /** Soumission du formulaire */
    submit: () => Promise<boolean>;
    /** Réinitialisation du formulaire */
    reset: () => void;
    /** Permet de remplacer le formulaire */
    setForm: React.Dispatch<React.SetStateAction<T>>;
    /** Champs gérés */
    fields: FieldKey<T>[];
    /** Libellés des champs */
    labels: (field: FieldKey<T>) => string;
    /**
     * Tokens d'autocomplétion pour chaque champ.
     * Voir https://developer.mozilla.org/docs/Web/HTML/Attributes/autocomplete
     */
    fieldAutoComplete?: Partial<Record<FieldKey<T>, string>>;
    /** Sauvegarde d'un champ individuel */
    updateEntity?: (field: FieldKey<T>, value: string) => Promise<void>;
    /** Effacement d'un champ individuel */
    clearField?: (field: FieldKey<T>) => Promise<void>;
    /** Suppression de l'entité */
    deleteEntity?: () => Promise<void>;
};

export default function EntityEditor<T extends Record<string, unknown>>(
    props: EntityEditorProps<T>
) {
    const {
        title,
        requiredFields = [],
        labelIcon,
        renderValue,
        extraButtons,
        deleteButtonLabel,
        className,
        onClearField,
        form,
        mode,
        setFieldValue,
        submit,
        reset,
        fields,
        labels,
        fieldAutoComplete,
        updateEntity,
        clearField,
        deleteEntity,
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
                    labelIcon={labelIcon}
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
                    saveField={() =>
                        updateEntity
                            ? updateEntity(editModeField.field, editModeField.value).then(() =>
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
                    setFieldValue={setFieldValue}
                    handleSubmit={() => submit().then(() => void 0)}
                    isEdit={false}
                    onCancel={handleCancel}
                    requiredFields={requiredFields}
                    fieldAutoComplete={fieldAutoComplete}
                />
            )}

            {mode === "edit" && !editModeField && deleteButtonLabel && (
                <div className="flex items-center justify-center mt-8">
                    <DeleteButton
                        onDelete={() => {
                            void deleteEntity?.();
                        }}
                        label={deleteButtonLabel}
                        className="!p-2 !h-8"
                        // size="medium"
                    />
                </div>
            )}
        </section>
    );
}

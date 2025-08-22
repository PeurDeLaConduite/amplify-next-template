"use client";
import React, { useState, forwardRef, useImperativeHandle, useCallback } from "react";
import type { FieldKey, FormMode } from "@entities/core/hooks";
import ReadOnlyView from "./ReadOnlyView";
import EditField from "./EditField";
import EntityForm from "./EntityForm";
import { DeleteButton } from "@components/buttons";

// Actions possibles sur un champ du formulaire
export type FieldAction<T> =
    | { type: "updateField"; field: FieldKey<T>; value: string } // modification locale
    | { type: "saveField"; field: FieldKey<T>; value: string } // persistance serveur
    | { type: "clearField"; field: FieldKey<T> } // remise à zéro
    | { type: "exitEditMode" }; // sortie du mode édition

type EntityEditorProps<T extends Record<string, unknown>> = {
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
    mode: FormMode;
    /** Indicateur de modification */
    dirty: boolean;
    /** Gestion des changements */
    handleChange: (field: FieldKey<T>, value: unknown) => void;
    /** Sauvegarde du formulaire complet */
    saveForm: () => Promise<boolean>;
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
    /** Callback facultatif pour réagir aux actions */
    onAction?: (action: FieldAction<T>) => void;
};

export type EntityEditorHandle = {
    reset: () => void;
};

function EntityEditorInner<T extends Record<string, unknown>>(
    props: EntityEditorProps<T>,
    ref: React.ForwardedRef<EntityEditorHandle>
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
        saveForm,
        reset,
        fields,
        labels,
        saveField,
        clearField,
        deleteEntity,
        onAction,
    } = props;

    const [editModeField, setEditModeField] = useState<{ field: FieldKey<T>; value: string } | null>(null);

    const exitEditMode = useCallback(() => {
        setEditModeField(null);
        onAction?.({ type: "exitEditMode" });
    }, [onAction]);

    const handleReset = useCallback(() => {
        exitEditMode();
        reset();
    }, [exitEditMode, reset]);

    useImperativeHandle(ref, () => ({ reset: handleReset }), [handleReset]);

    const handleClearField = (field: FieldKey<T>) => {
        if (onClearField) {
            onClearField(field, async (f) => {
                await clearField?.(f);
                onAction?.({ type: "clearField", field: f });
            });
        } else {
            void clearField?.(field);
            onAction?.({ type: "clearField", field });
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
                            ? saveField(editModeField.field, editModeField.value).then(() => {
                                  setEditModeField(null);
                                  onAction?.({
                                      type: "saveField",
                                      field: editModeField.field,
                                      value: editModeField.value,
                                  });
                              })
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
                    handleChange={(field, value) => {
                        handleChange(field, value);
                        onAction?.({
                            type: "updateField",
                            field,
                            value: String(value ?? ""),
                        });
                    }}
                    handleSubmit={() => saveForm().then(() => void 0)}
                    isEdit={false}
                    onCancel={handleReset}
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
                        size="medium"
                    />
                </div>
            )}
        </section>
    );
}

export default forwardRef(EntityEditorInner) as <T extends Record<string, unknown>>(
    props: EntityEditorProps<T> & { ref?: React.Ref<EntityEditorHandle> }
) => React.ReactElement;

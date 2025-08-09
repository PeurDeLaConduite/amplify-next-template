"use client";
import React from "react";
import type { FieldKey, EntityManagerResult } from "@src/hooks/useEntityManagerGeneral";
import ReadOnlyView from "./ReadOnlyView";
import EditField from "./EditField";
import EntityForm from "./EntityForm";
import { DeleteButton } from "../../buttons/Buttons";

export type EntitySectionProps<T extends Record<string, unknown>> = {
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
    onClearField?: (field: FieldKey<T>, clear: (field: FieldKey<T>) => void) => void;
    /** Gestionnaire de l'entité */
    manager: EntityManagerResult<T>;
};

export default function EntitySection<T extends Record<string, unknown>>({
    title,
    requiredFields = [],
    renderIcon,
    renderValue,
    extraButtons,
    deleteLabel,
    className,
    onClearField,
    manager,
}: EntitySectionProps<T>) {
    const {
        entity,
        formData,
        setFormData,
        editMode,
        setEditMode,
        editModeField,
        setEditModeField,
        handleChange,
        save,
        saveField,
        clearField,
        deleteEntity,
        labels,
        fields,
        fetchData,
    } = manager;

    const handleCancel = () => {
        setEditMode(false);
        if (entity) {
            const reset = { ...formData } as T;
            fields.forEach((f) => {
                reset[f] = entity[f];
            });
            setFormData(reset);
        } else {
            void fetchData();
        }
    };

    const handleClearField = (field: FieldKey<T>) => {
        if (onClearField) {
            onClearField(field, clearField);
        } else {
            void clearField(field);
        }
    };

    return (
        <section
            className={`w-full max-w-md mx-auto px-4 py-6 bg-white shadow rounded-lg mb-8 ${
                className ?? ""
            }`}
        >
            <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>

            {!editMode && entity && !editModeField && (
                <ReadOnlyView<T>
                    title={title}
                    fields={fields}
                    data={formData}
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
                    saveSingleField={saveField}
                    labels={labels}
                />
            )}

            {(editMode || !entity) && !editModeField && (
                <EntityForm<T>
                    formData={formData}
                    fields={fields}
                    labels={labels}
                    handleChange={handleChange}
                    handleSubmit={save}
                    isEdit={!!entity}
                    onCancel={handleCancel}
                    requiredFields={requiredFields}
                />
            )}

            {entity && !editMode && !editModeField && deleteLabel && (
                <div className="flex items-center justify-center mt-8">
                    <DeleteButton onClick={deleteEntity} label={deleteLabel} />
                </div>
            )}
        </section>
    );
}

// src/components/Blog/manage/authors/AuthorForm.tsx
"use client";
import React, { forwardRef, type ChangeEvent, type FormEvent } from "react";
import EditableField from "@components/forms/EditableField";
import EditableTextArea from "@components/forms/EditableTextArea";
import { SaveButton, CancelButton, DeleteButton } from "@components/buttons";
import { type AuthorFormType, useAuthorManager } from "@entities/models/author";

interface Props {
    manager: ReturnType<typeof useAuthorManager>;
    onSave: () => void;
}

const AuthorForm = forwardRef<HTMLFormElement, Props>(function AuthorForm(
    { manager, onSave },
    ref
) {
    const {
        form,
        updateField,
        createEntity,
        updateEntity,
        deleteById,
        cancelEdit,
        isEditing,
        editingId,
    } = manager;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateField(name as keyof AuthorFormType, value as never);
    };

    const handleSave = async () => {
        if (isEditing && editingId) {
            await updateEntity(editingId, form);
        } else {
            await createEntity(form);
        }
        cancelEdit();
        onSave();
    };

    const handleDelete = async () => {
        if (!editingId) return;
        await deleteById(editingId);
        cancelEdit();
        onSave();
    };

    const handleCancel = () => {
        cancelEdit();
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleSave();
    };

    return (
        <form ref={ref} onSubmit={handleSubmit} className="grid gap-2 mb-6">
            <EditableField
                name="authorName"
                label="Nom"
                value={form.authorName ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableField
                name="avatar"
                label="URL de l'avatar"
                value={form.avatar ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableTextArea
                name="bio"
                label="Bio"
                value={form.bio ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <EditableField
                name="email"
                label="Email"
                value={form.email ?? ""}
                onChange={onChange}
                readOnly={false}
            />
            <div className="flex space-x-2 mt-2">
                <SaveButton
                    onClick={handleSave}
                    label={isEditing ? "Mettre à jour" : "Ajouter un auteur"}
                />
                {isEditing && (
                    <>
                        <CancelButton onClick={handleCancel} label="Annuler" />
                        <DeleteButton onClick={handleDelete} label="Supprimer" />
                    </>
                )}
            </div>
        </form>
    );
});

export default AuthorForm;

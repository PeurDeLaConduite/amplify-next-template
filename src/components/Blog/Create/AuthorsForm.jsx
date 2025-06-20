// src/components/Blog/Create/AuthorsForm.jsx
"use client";

import React from "react";
import EditableField from "./components/EditableField";
import FormActionButtons from "./FormActionButtons";
import useEditableForm from "@/src/hooks/useEditableForm";
import EditableTextArea from "./components/EditableTextArea";
export default function AuthorsForm({ authors, setAuthors }) {
    const initialForm = {
        id: "",
        name: "",
        avatar: "",
        bio: "",
        email: "",
    };

    const { form, editingIndex, handleChange, handleSave, handleEdit, handleCancel, handleDelete } =
        useEditableForm({
            initialForm,
            items: authors,
            setItems: setAuthors,
            itemKey: "id",
            idPrefix: "A", // ← préfixe pour les IDs auteurs
            prepareItem: (item) => item,
        });

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Auteurs</h2>

            <form onSubmit={(e) => e.preventDefault()} className="grid gap-2">
                {/* ID généré automatiquement, lecture seule */}
                <EditableField
                    name="id"
                    label="ID"
                    value={form.id}
                    onChange={handleChange}
                    readOnly
                />

                <EditableField
                    name="name"
                    label="Nom"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableField
                    name="avatar"
                    label="Avatar Url"
                    value={form.avatar}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableTextArea
                    name="bio"
                    label="Bio"
                    value={form.bio}
                    onChange={handleChange}
                    readOnly={false}
                />

                <EditableField
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={false}
                />

                {/* Bouton Ajouter si on est en création */}
                {editingIndex === null && (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Ajouter l'auteur
                    </button>
                )}
            </form>

            <ul className="mt-4 space-y-2">
                {authors.map((author, idx) => {
                    const active = editingIndex === idx;
                    return (
                        <li
                            key={author.id}
                            className={`flex justify-between items-center p-2 transition-colors duration-300 ${
                                active ? "bg-yellow-100 shadow-sm" : "border-b"
                            }`}
                        >
                            <div>
                                <strong>{author.name}</strong> — {author.email}
                            </div>
                            <FormActionButtons
                                editingIndex={editingIndex}
                                currentIndex={idx}
                                onEdit={() => handleEdit(idx)}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDelete={() => handleDelete(idx)}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

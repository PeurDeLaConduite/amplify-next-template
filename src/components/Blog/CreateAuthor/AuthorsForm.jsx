"use client";

import React, { useState } from "react";
import EditableField from "../Create/components/EditableField";
import EditableTextArea from "../Create/components/EditableTextArea";
import FormActionButtons from "../Create/FormActionButtons";

const initialForm = {
    name: "",
    avatar: "",
    bio: "",
    email: "",
};

export default function AuthorsForm({ authors, onAdd, onUpdate, onDelete }) {
    const [form, setForm] = useState(initialForm);
    const [editingIndex, setEditingIndex] = useState(null);

    // Récupère la structure actuelle depuis Amplify Data
    const getAuthorDisplay = (author) => (author.author ? author.author : author);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEdit = (idx) => {
        setEditingIndex(idx);
        const a = getAuthorDisplay(authors[idx]);
        setForm({
            name: a.name || "",
            avatar: a.avatar || "",
            bio: a.bio || "",
            email: a.email || "",
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(initialForm);
    };

    const handleSave = () => {
        if (!form.name) return;
        if (editingIndex === null) {
            onAdd(form);
        } else {
            onUpdate(authors[editingIndex].id, form);
        }
        handleCancel();
    };

    const handleDeleteLocal = (idx) => {
        if (authors[idx]?.id) {
            onDelete(authors[idx].id);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Auteurs</h2>
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-2">
                <EditableField name="name" label="Nom" value={form.name} onChange={handleChange} />
                <EditableField
                    name="avatar"
                    label="Avatar Url"
                    value={form.avatar}
                    onChange={handleChange}
                />
                <EditableTextArea name="bio" label="Bio" value={form.bio} onChange={handleChange} />
                <EditableField
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                {editingIndex === null && (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Ajouter un auteur
                    </button>
                )}
            </form>

            <ul className="mt-4 space-y-2">
                {authors.map((author, idx) => {
                    const a = getAuthorDisplay(author);
                    const active = editingIndex === idx;
                    return (
                        <li
                            key={author.id}
                            className={`flex justify-between items-center p-2 transition-colors duration-300 ${
                                active ? "bg-yellow-100 shadow-sm" : "border-b"
                            }`}
                        >
                            <div>
                                <strong>{a.name}</strong> — {a.email}
                            </div>
                            <FormActionButtons
                                editingIndex={editingIndex}
                                currentIndex={idx}
                                onEdit={() => handleEdit(idx)}
                                onSave={handleSave}
                                onCancel={handleCancel}
                                onDelete={() => handleDeleteLocal(idx)}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

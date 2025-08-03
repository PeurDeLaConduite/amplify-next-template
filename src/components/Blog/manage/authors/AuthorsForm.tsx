"use client";

import React from "react";
import EditableField from "../components/EditableField";
import EditableTextArea from "../components/EditableTextArea";
import FormActionButtons from "../components/FormActionButtons";
import { useAuthorForm } from "./useAuthorForm";
import { type AuthorType  } from "@src/entities";

interface Props {
    authors: AuthorType [];
    setMessage: (msg: string) => void;
}

export default function AuthorsForm({ authors, setMessage }: Props) {
    const { form, editingIndex, handleChange, handleEdit, handleCancel, handleSave, handleDelete } =
        useAuthorForm(authors, setMessage);

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b">Liste d&apos;auteurs</h2>
            <ul className="mt-4 space-y-2">
                {authors.map((author, idx) => {
                    const active = editingIndex === idx;
                    return (
                        <li
                            key={author.id}
                            className={`flex justify-between items-center p-2 transition-colors duration-300 ${
                                active ? "bg-yellow-100 shadow-sm " : "bg-white "
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
                                isFormNew={false}
                            />
                        </li>
                    );
                })}
            </ul>
            <h2 className="text-xl font-semibold mb-4 mt-8 border-b">Nouvel auteur</h2>
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-2">
                <EditableField
                    name="name"
                    label="Nom"
                    value={form.name ?? ""}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableField
                    name="avatar"
                    label="URL de l'avatar"
                    value={form.avatar ?? ""}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableTextArea
                    name="bio"
                    label="Bio"
                    value={form.bio ?? ""}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableField
                    name="email"
                    label="Email"
                    value={form.email ?? ""}
                    onChange={handleChange}
                    readOnly={false}
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
        </div>
    );
}

import React from "react";
import EditableField from "../components/EditableField";
import EditableTextArea from "../components/EditableTextArea";
import FormActionButtons from "../components/FormActionButtons";
import { useAuthorForm } from "@entities/models/author/hooks";

interface Props {
    setMessage: (msg: string) => void;
}

export default function AuthorsForm({ setMessage }: Props) {
    const {
        authors,
        form,
        editingIndex,
        loading,
        handleFormChange,
        handleEdit,
        handleCancel,
        handleSave,
        handleDelete,
    } = useAuthorForm(setMessage);

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4 border-b">
                {loading && <span className=" ml-2 animate-pulse">Actualisation…</span>}
                Liste d&apos;auteurs
            </h2>

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
                                <strong>{author.authorName}</strong> — {author.email}
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
                    name="authorName"
                    label="Nom"
                    value={form.authorName ?? ""}
                    onChange={handleFormChange}
                    readOnly={false}
                />
                <EditableField
                    name="avatar"
                    label="URL de l'avatar"
                    value={form.avatar ?? ""}
                    onChange={handleFormChange}
                    readOnly={false}
                />
                <EditableTextArea
                    name="bio"
                    label="Bio"
                    value={form.bio ?? ""}
                    onChange={handleFormChange}
                    readOnly={false}
                />
                <EditableField
                    name="email"
                    label="Email"
                    value={form.email ?? ""}
                    onChange={handleFormChange}
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

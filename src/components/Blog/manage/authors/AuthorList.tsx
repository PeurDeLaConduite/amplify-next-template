"use client";

import React from "react";
import { type AuthorType } from "@entities/models/author";
import FormActionButtons from "@components/Blog/manage/components/FormActionButtons";

interface Props {
    authors: AuthorType[];
    editingIndex: number | null;
    loading: boolean;
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;
}

export default function AuthorList({
    authors,
    editingIndex,
    loading,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: Props) {
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
                                onEdit={() => onEdit(idx)}
                                onSave={onSave}
                                onCancel={onCancel}
                                onDelete={() => onDelete(idx)}
                                isFormNew={false}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

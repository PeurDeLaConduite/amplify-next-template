"use client";
import React from "react";
import { type SectionTypes } from "@/src/entities/models/section";
import FormActionButtons from "../components/FormActionButtons";

interface Props {
    sections: SectionTypes[];
    editingId: string | null;
    onEdit: (id: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

export default function SectionList({
    sections,
    editingId,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: Props) {
    return (
        <ul className="mt-6 space-y-2">
            {sections
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((section) => {
                    const active = editingId === section.id;
                    return (
                        <li
                            key={section.id}
                            className={`flex justify-between items-center p-2 transition-colors duration-300 ${
                                active ? "bg-yellow-100 shadow-sm" : "border-b"
                            }`}
                        >
                            <div>
                                <strong>{section.title}</strong> (ordre : {section.order})
                            </div>
                            <FormActionButtons
                                editingId={editingId}
                                currentId={section.id}
                                onEdit={() => onEdit(section.id)}
                                onSave={onSave}
                                onCancel={onCancel}
                                onDelete={() => onDelete(section.id)}
                                isFormNew={false}
                            />
                        </li>
                    );
                })}
        </ul>
    );
}

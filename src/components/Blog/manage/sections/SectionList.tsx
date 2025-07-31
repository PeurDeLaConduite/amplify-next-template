"use client";
import React from "react";
import type { Section } from "@/src/types";
import FormActionButtons from "../components/FormActionButtons";

interface Props {
    sections: Section[];
    editingIndex: number | null;
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;
}

export default function SectionList({
    sections,
    editingIndex,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: Props) {
    return (
        <ul className="mt-6 space-y-2">
            {sections
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((section, idx) => {
                    const active = editingIndex === idx;
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
    );
}

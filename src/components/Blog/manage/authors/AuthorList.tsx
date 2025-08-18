// src/components/Blog/manage/AuthorList.tsx
"use client";

import React from "react";
import GenericList from "@components/Blog/manage/GenericList";
import { byAlpha } from "@components/Blog/manage/sorters";
import { type AuthorType } from "@entities/models/author";

interface Props {
    authors: AuthorType[];
    editingIndex: number | null;
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;
}

export default function AuthorList(props: Props) {
    return (
        <GenericList<AuthorType>
            items={props.authors}
            editingIndex={props.editingIndex}
            getKey={(a) => a.id}
            renderContent={(a) => (
                <p className="self-center">
                    <strong>{a.authorName}</strong> — {a.email}
                </p>
            )}
            sortBy={byAlpha((a) => a.authorName)}
            onEdit={props.onEdit}
            onSave={props.onSave}
            onCancel={props.onCancel}
            onDelete={props.onDelete}
        />
    );
}

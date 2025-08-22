// src/components/Blog/manage/AuthorList.tsx
"use client";

import React from "react";
import GenericList from "@components/Blog/manage/GenericList";
import { byAlpha } from "@components/Blog/manage/sorters";
import { type AuthorType } from "@entities/models/author";

type IdLike = string | number;

interface Props {
    authors: AuthorType[];
    editingId: IdLike | null;
    onEditById: (id: IdLike) => void;
    onUpdate: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
}

export default function AuthorList(props: Props) {
    return (
        <GenericList<AuthorType>
            items={props.authors}
            editingId={props.editingId}
            getId={(a) => a.id}
            renderContent={(a) => (
                <p className="self-center">
                    <strong>{a.authorName}</strong> — {a.email}
                </p>
            )}
            sortBy={byAlpha((a) => a.authorName)}
            onEditById={props.onEditById}
            onUpdate={props.onUpdate}
            onCancel={props.onCancel}
            onDeleteById={props.onDeleteById}
        />
    );
}

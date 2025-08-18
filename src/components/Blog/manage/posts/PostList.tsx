// src/components/Blog/manage/PostList.tsx
"use client";

import React from "react";
import GenericList from "../GenericList";
import { byOptionalOrder } from "../sorters";
import { type PostType } from "@/src/entities/models/post";

interface Props {
    posts: PostType[];
    editingIndex: number | null;
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;
}

export default function PostList(props: Props) {
    return (
        <GenericList<PostType>
            items={props.posts}
            editingIndex={props.editingIndex}
            getKey={(p) => p.id}
            renderContent={(p) => (
                <p className="self-center">
                    <strong>{p.title}</strong> (ordre : {p.order})
                </p>
            )}
            sortBy={byOptionalOrder}
            onEdit={props.onEdit}
            onSave={props.onSave}
            onCancel={props.onCancel}
            onDelete={props.onDelete}
        />
    );
}

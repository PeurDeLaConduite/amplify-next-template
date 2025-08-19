// src/components/Blog/manage/PostList.tsx
"use client";

import React from "react";
import GenericList from "../GenericList";
import { byOptionalOrder } from "../sorters";
import { type PostType } from "@/src/entities/models/post";

type IdLike = string | number;

interface Props {
    posts: PostType[];
    editingId: IdLike | null;
    onEditById: (id: IdLike) => void;
    onSave: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
}

export default function PostList(props: Props) {
    return (
        <GenericList<PostType>
            items={props.posts}
            editingId={props.editingId}
            getKey={(p) => p.id}
            renderContent={(p) => (
                <p className="self-center">
                    <strong>{p.title}</strong> (ordre : {p.order})
                </p>
            )}
            sortBy={byOptionalOrder}
            onEdit={props.onEditById}
            onSave={props.onSave}
            onCancel={props.onCancel}
            onDelete={props.onDeleteById}
        />
    );
}

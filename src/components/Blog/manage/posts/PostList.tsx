// src/components/Blog/manage/PostList.tsx
"use client";

import React from "react";
import GenericList from "@components/Blog/manage/GenericList";
import { byOptionalOrder } from "@components/Blog/manage/sorters";
import { type PostType } from "@entities/models/post";

type IdLike = string | number;

interface Props {
    posts: PostType[];
    postId: IdLike | null;
    onEditById: (id: IdLike) => void;
    onUpdate: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
}

export default function PostList(props: Props) {
    return (
        <GenericList<PostType>
            items={props.posts}
            editingId={props.postId}
            getId={(p) => p.id}
            renderContent={(p) => (
                <p className="self-center">
                    <strong>{p.title}</strong> — (ordre : {p.order})
                </p>
            )}
            sortBy={byOptionalOrder}
            onEditById={props.onEditById}
            onUpdate={props.onUpdate}
            onCancel={props.onCancel}
            onDeleteById={props.onDeleteById}
            editButtonLabel="Modifier"
            deleteButtonLabel="Supprimer"
        />
    );
}

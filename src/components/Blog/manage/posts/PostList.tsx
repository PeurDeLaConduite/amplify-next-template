// src/components/Blog/manage/PostList.tsx
"use client";

import React from "react";
import GenericList from "@components/Blog/manage/GenericList";
import { byOptionalOrder } from "@components/Blog/manage/sorters";
import { type PostType } from "@entities/models/post";

type IdLike = string | number;

interface Props {
    posts: PostType[];
    editingId: IdLike | null;
    selectById: (id: IdLike) => void;
    enterEditMode: (id: IdLike) => void;
    requestSubmit: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
}

export default function PostList(props: Props) {
    return (
        <GenericList<PostType>
            items={props.posts}
            editingId={props.editingId}
            getId={(p) => p.id}
            renderContent={(p) => (
                <p className="self-center">
                    <strong>{p.title}</strong> (ordre : {p.order})
                </p>
            )}
            sortBy={byOptionalOrder}
            selectById={props.selectById}
            enterEditMode={props.enterEditMode}
            requestSubmit={props.requestSubmit}
            onCancel={props.onCancel}
            onDeleteById={props.onDeleteById}
            editButtonLabel="Modifier"
            deleteButtonLabel="Supprimer"
        />
    );
}

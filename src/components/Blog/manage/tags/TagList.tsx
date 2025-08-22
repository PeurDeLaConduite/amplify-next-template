"use client";

import React from "react";
import GenericList from "@components/Blog/manage/GenericList";
import { byAlpha } from "@components/Blog/manage/sorters";
import type { TagType } from "@entities/models/tag/types";

type IdLike = string | number;

interface Props {
    tags: TagType[];
    editingId: IdLike | null;
    onEditById: (id: IdLike) => void;
    onUpdate: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
    editButtonLabel: string;
    deleteButtonLabel: string;
}

function TagListInner({
    tags,
    editingId,
    onEditById,
    onUpdate,
    onCancel,
    onDeleteById,
    editButtonLabel,
    deleteButtonLabel,
}: Props) {
    return (
        <GenericList<TagType>
            items={tags}
            editingId={editingId}
            getId={(t) => t.id}
            renderContent={(t) => (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-sm font-semibold">
                    {t.name}
                </span>
            )}
            /** UL : wrap + gap */
            className="flex flex-wrap gap-x-4 gap-y-2"
            /** LI : occupe l’espace restant grâce à flex-grow */
            itemClassName={(active) =>
                [
                    "flex-2 min-w-[40%] p-1.5 group flex items-center justify-between",
                    " rounded-lg border shadow-sm capitalize",
                    "bg-white/80 backdrop-blur-sm transition-all duration-200 ",
                    active
                        ? "bg-blue-50 border-blue-300 ring-1 ring-blue-200"
                        : "border-slate-200 hover:bg-slate-50/60 hover:border-blue-200 hover:shadow",
                ].join(" ")
            }
            sortBy={byAlpha((t) => t.name)}
            onEditById={onEditById}
            onUpdate={onUpdate}
            onCancel={onCancel}
            onDeleteById={onDeleteById}
            editButtonLabel={editButtonLabel}
            deleteButtonLabel={deleteButtonLabel}
        />
    );
}

const TagList = React.memo(TagListInner);
export default TagList;

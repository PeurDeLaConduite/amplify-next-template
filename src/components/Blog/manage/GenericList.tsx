// src/components/blog/manage/GenericList.tsx
"use client";

import React, { useMemo } from "react";
import FormActionButtons from "./components/FormActionButtons";

type IdLike = string | number;

interface GenericListProps<T> {
    items: T[];
    editingId: IdLike | null;

    /** Identifiant unique pour chaque item */
    getId: (item: T) => IdLike;

    /** Contenu côté gauche (texte, balises, etc.) */
    renderContent: (item: T, index: number) => React.ReactNode;

    /** Tri optionnel (on ne mute jamais items) */
    sortBy?: (a: T, b: T) => number;

    /** Actions */
    enterEditModeById: (id: IdLike) => void;
    requestSubmit: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
    onRequestSubmit?: () => void;

    /** Style */
    className?: string;
    itemWrapperClassName?: string;
    itemClassName?: (active: boolean) => string;
    /** Arrondis/ombres cohérents */
    rounded?: boolean;
    editButtonLabel?: string;
    deleteButtonLabel?: string;
}

export default function GenericList<T>({
    items,
    editingId,
    getId,
    renderContent,
    sortBy,
    enterEditModeById,
    requestSubmit,
    onCancel,
    onDeleteById,
    onRequestSubmit,
    className,
    itemWrapperClassName,
    itemClassName,
    rounded = true,
    editButtonLabel,
    deleteButtonLabel,
}: GenericListProps<T>) {
    const sorted = useMemo(() => {
        const indexed = items.map((item, originalIndex) => ({
            item,
            originalIndex,
            id: getId(item),
        }));
        return sortBy ? indexed.slice().sort((a, b) => sortBy(a.item, b.item)) : indexed;
    }, [items, sortBy, getId]);

    return (
        <ul className={`mt-4 mb-6 space-y-2 ${className ?? ""}`}>
            {sorted.map(({ item, originalIndex, id }) => {
                const active = editingId === id;
                const base =
                    "flex justify-between items-center p-4 gap-4 transition-colors duration-300";
                const activeCls = active ? "bg-yellow-100 shadow-sm" : "bg-white";
                const radius = rounded ? "rounded-sm" : "";
                const liClass = itemClassName?.(active) ?? `${base} ${activeCls} ${radius}`;

                return (
                    <li key={String(id)} className={`${liClass} ${itemWrapperClassName ?? ""}`}>
                        <div className="self-center">{renderContent(item, originalIndex)}</div>
                        <FormActionButtons
                            editingId={editingId}
                            currentId={id}
                            onEdit={() => enterEditModeById(id)}
                            requestSubmit={requestSubmit}
                            onRequestSubmit={onRequestSubmit}
                            onCancel={onCancel}
                            onDelete={() => onDeleteById(id)}
                            isFormNew={false}
                            editButtonLabel={editButtonLabel}
                            deleteButtonLabel={deleteButtonLabel}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

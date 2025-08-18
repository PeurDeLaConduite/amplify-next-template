// src/components/blog/manage/GenericList.tsx
"use client";

import React, { useMemo } from "react";
import FormActionButtons from "./components/FormActionButtons";

type IdLike = string | number;

export interface GenericListProps<T> {
    items: T[];
    editingIndex: number | null;

    /** Unique key pour chaque item */
    getKey: (item: T, index: number) => IdLike;

    /** Contenu côté gauche (texte, balises, etc.) */
    renderContent: (item: T, index: number) => React.ReactNode;

    /** Tri optionnel (on ne mute jamais items) */
    sortBy?: (a: T, b: T) => number;

    /** Actions */
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;

    /** Style */
    className?: string;
    itemClassName?: (active: boolean) => string;
    /** Arrondis/ombres cohérents */
    rounded?: boolean;
}

export default function GenericList<T>({
    items,
    editingIndex,
    getKey,
    renderContent,
    sortBy,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    className,
    itemClassName,
    rounded = true,
}: GenericListProps<T>) {
    const sorted = useMemo(() => (sortBy ? [...items].sort(sortBy) : items), [items, sortBy]);

    return (
        <ul className={`mt-4 mb-6 space-y-2 ${className ?? ""}`}>
            {sorted.map((item, idx) => {
                const active = editingIndex === idx;
                const base =
                    "flex justify-between items-center p-4 gap-4 transition-colors duration-300";
                const activeCls = active ? "bg-yellow-100 shadow-sm" : "bg-white";
                const radius = rounded ? "rounded-sm" : "";
                const liClass = itemClassName?.(active) ?? `${base} ${activeCls} ${radius}`;

                return (
                    <li key={String(getKey(item, idx))} className={liClass}>
                        <div className="self-center">{renderContent(item, idx)}</div>
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

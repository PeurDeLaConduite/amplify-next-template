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
    const sorted = useMemo(() => {
        const indexed = items.map((item, idx) => ({ item, idx }));
        return sortBy ? indexed.sort((a, b) => sortBy(a.item, b.item)) : indexed;
    }, [items, sortBy]);

    return (
        <ul className={`mt-4 mb-6 space-y-2 ${className ?? ""}`}>
            {sorted.map(({ item, idx: originalIdx }) => {
                const active = editingIndex === originalIdx;
                const base =
                    "flex justify-between items-center p-4 gap-4 transition-colors duration-300";
                const activeCls = active ? "bg-yellow-100 shadow-sm" : "bg-white";
                const radius = rounded ? "rounded-sm" : "";
                const liClass = itemClassName?.(active) ?? `${base} ${activeCls} ${radius}`;

                return (
                    <li key={String(getKey(item, originalIdx))} className={liClass}>
                        <div className="self-center">{renderContent(item, originalIdx)}</div>
                        <FormActionButtons
                            editingIndex={editingIndex}
                            currentIndex={originalIdx}
                            onEdit={() => onEdit(originalIdx)}
                            onSave={onSave}
                            onCancel={onCancel}
                            onDelete={() => onDelete(originalIdx)}
                            isFormNew={false}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

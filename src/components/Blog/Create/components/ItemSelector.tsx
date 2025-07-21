// components/ItemSelector.tsx
import React from "react";

export interface ItemSelectorProps<
    T extends Record<K, string>, // on garantit que T[K] est string
    K extends keyof T, // K est une clé de T
> {
    /** Les objets à lister */
    items: T[];
    /** Clé utilisée comme identifiant (ex. "id") */
    idKey: K;
    /** IDs actuellement sélectionnés */
    selectedIds: T[K][];
    /** Appelé avec le nouveau tableau d’IDs */
    onChange: (newIds: T[K][]) => void;
    /** Label au‑dessus de la liste */
    label: string;
    /** Pour extraire un affichage textuel depuis un objet T */
    getLabel: (item: T) => string;
}

export default function ItemSelector<T extends Record<K, string>, K extends keyof T>({
    items,
    idKey,
    selectedIds,
    onChange,
    label,
    getLabel,
}: ItemSelectorProps<T, K>) {
    const toggle = (id: T[K]) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((x) => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-3">{label}</label>
            <div className="border rounded-md max-h-60 overflow-auto p-2 bg-gray-50">
                {items.map((item, idx) => {
                    const id = item[idKey]; // de type string
                    const checked = selectedIds.includes(id);
                    return (
                        <div
                            key={id || `item-${idx}`}
                            className={`flex items-center p-2 mb-1 rounded-md cursor-pointer ${
                                checked
                                    ? "bg-green-100 border border-green-400"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                            onClick={() => toggle(id)}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(id)}
                                className="mr-2 cursor-pointer"
                            />
                            <div>
                                <span className="font-medium">{getLabel(item)}</span>{" "}
                                <span className="text-sm text-gray-500">(ID: {id})</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

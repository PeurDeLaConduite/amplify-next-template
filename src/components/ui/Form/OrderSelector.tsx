import React from "react";
import SelectField from "./SelectField";

interface Props {
    items: { id: string }[];
    editingId: string | null; // null si l'élément n'existe pas encore
    value: number; // valeur en base 1 (1,2,3,...)
    onReorder: (editingId: string | null, newOrder: number) => void; // newOrder en base 1
}

export default function OrderSelector({ items, editingId, value, onReorder }: Props) {
    const currentIndex = editingId ? items.findIndex((s) => s.id === editingId) : -1;
    const isNew = currentIndex < 0 || currentIndex >= items.length;
    const max = isNew ? items.length + 1 : items.length;

    const options = Array.from({ length: max }, (_, i) => {
        const n = i + 1; // 1..max
        return { value: String(n), label: String(n) };
    });

    // Sécurise la valeur affichée dans la fourchette [1, max]
    const safeValue = Math.min(Math.max(value ?? 1, 1), max);

    const setFieldValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPosition = parseInt(e.target.value, 10); // base 1
        onReorder(editingId, newPosition);
    };

    return (
        <SelectField
            label="Ordre"
            name="order"
            value={String(safeValue)}
            onChange={setFieldValue}
            options={options}
        />
    );
}

// src/components/OrderSelector.tsx
import React from "react";
import SelectField from "./SelectField";

interface Props {
    sections: { id: string }[]; // ou un type Section si tu veux plus strict
    currentIndex: number;
    value: number;
    onReorder: (currentIndex: number, newOrder: number) => void;
}

export default function OrderSelector({
    sections,
    currentIndex,
    value,
    onReorder,
}: Props) {
    const max = currentIndex >= sections.length ? sections.length + 1 : sections.length;
    const options = Array.from({ length: Math.max(max, 1) }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
    }));

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPosition = parseInt(e.target.value, 10);
        onReorder(currentIndex, newPosition);
    };

    return (
        <SelectField
            label="Ordre"
            name="order"
            value={String(value)}
            onChange={handleChange}
            options={options}
        />
    );
}

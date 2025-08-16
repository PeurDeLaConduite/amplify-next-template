import React from "react";
import SelectField from "./SelectField";

interface Props {
    sections: { id: string }[];
    currentIndex: number; // -1 si l'élément n'existe pas encore
    value: number; // valeur en base 1 (1,2,3,...)
    onReorder: (currentIndex: number, newOrder: number) => void; // newOrder en base 1
}

export default function OrderSelector({ sections, currentIndex, value, onReorder }: Props) {
    const isNew = currentIndex < 0 || currentIndex >= sections.length;
    const max = isNew ? sections.length + 1 : sections.length;

    const options = Array.from({ length: max }, (_, i) => {
        const n = i + 1; // 1..max
        return { value: String(n), label: String(n) };
    });

    // Sécurise la valeur affichée dans la fourchette [1, max]
    const safeValue = Math.min(Math.max(value ?? 1, 1), max);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPosition = parseInt(e.target.value, 10); // base 1
        onReorder(currentIndex, newPosition);
    };

    return (
        <SelectField
            label="Ordre"
            name="order"
            value={String(safeValue)}
            onChange={handleChange}
            options={options}
        />
    );
}

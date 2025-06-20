import React from "react";

export default function OrderSelector({ sections, currentIndex, value, onReorder }) {
    const max = sections.length;
    const options = Array.from({ length: max }, (_, i) => i + 1);

    const handleChange = (e) => {
        const newPosition = parseInt(e.target.value, 10);
        onReorder(currentIndex, newPosition);
    };

    return (
        <label className="block mb-2">
            Ordre
            <select
                value={value}
                onChange={handleChange}
                className="block w-full mt-1 p-2 border rounded"
            >
                {options.map((pos) => (
                    <option key={pos} value={pos}>
                        {pos}
                    </option>
                ))}
            </select>
        </label>
    );
}

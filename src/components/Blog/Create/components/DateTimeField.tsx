// src/components/Form/DateTimeField.jsx
import React from "react";

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

/**
 * Convertit une ISO-string en valeur pour datetime-local : "YYYY-MM-DDThh:mm"
 */
function isoToInput(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    const y = d.getFullYear();
    const M = pad(d.getMonth() + 1);
    const D = pad(d.getDate());
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());
    return `${y}-${M}-${D}T${h}:${m}`;
}

/**
 * DateTimeField — input datetime-local backed by ISO-string
 */
export function DateTimeField({
    label,
    name,
    value,
    onChange,
    readOnly = false,
}: {
    label: string;
    name: string;
    value: string; // ISO string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
}) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // reconvertit la valeur locale en ISO
        const iso = new Date(e.target.value).toISOString();
        // on transmet un event-like à ton handleChange
        onChange({
            ...e,
            target: { ...e.target, name, value: iso },
        });
    };

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type="datetime-local"
                id={name}
                name={name}
                value={isoToInput(value)}
                onChange={handleChange}
                readOnly={readOnly}
                className="w-full border rounded px-3 py-2 bg-white"
            />
        </div>
    );
}

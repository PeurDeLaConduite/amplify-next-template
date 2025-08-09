// src/components/SelectField.tsx
import React from "react";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: string;
    value: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    hideLabel?: boolean; // optionnel : cacher visuellement le label (accessibilité conservée)
}

export default function SelectField({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    hideLabel = false,
    ...rest
}: SelectFieldProps) {
    const id = `select-${name}`;

    return (
        <div className="mb-2">
            <label htmlFor={id} className={hideLabel ? "sr-only" : "block font-medium mb-1"}>
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="border p-2 w-full rounded bg-white"
                {...rest}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

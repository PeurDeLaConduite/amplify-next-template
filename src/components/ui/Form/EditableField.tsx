import React, { ChangeEvent, FocusEvent } from "react";

type EditableFieldProps = {
    label: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    readOnly: boolean;
    name: string;
    type?: string;
    autoComplete?: string;
    onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    ariaDescribedBy?: string;
};

const EditableField = ({
    label,
    value = "",
    onChange,
    readOnly,
    name,
    type = "text",
    autoComplete,
    onFocus,
    onBlur,
    ariaDescribedBy,
}: EditableFieldProps) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
            {label}
        </label>
        <input
            type={type ?? "text"}
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            autoComplete={autoComplete}
            aria-describedby={ariaDescribedBy}
            className={`w-full px-3 py-2 rounded-md border text-sm shadow-sm transition
                ${
                    readOnly
                        ? "bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white border-blue-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                }`}
        />
    </div>
);

export default EditableField;

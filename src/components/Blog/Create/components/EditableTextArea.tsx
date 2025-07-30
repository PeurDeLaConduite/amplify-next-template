import React, { ChangeEvent, FocusEvent } from "react";

type EditableTextAreaProps = {
    label: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    readOnly: boolean;
    name: string;
    onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const EditableTextArea = ({
    label,
    value = "",
    onChange,
    readOnly,
    name,
    onFocus,
    onBlur,
}: EditableTextAreaProps) => (
    <div style={{ marginBottom: "1rem" }}>
        <label htmlFor={name} style={{ display: "block", marginBottom: "0.5rem" }}>
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            style={{
                width: "100%",
                padding: "8px",
                border: `1px solid ${readOnly ? "gray" : "blue"}`,
                backgroundColor: readOnly ? "#f4f4f4" : "#fff",
                borderRadius: "4px",
                resize: "vertical",
                minHeight: "80px",
            }}
        />
    </div>
);

export default EditableTextArea;

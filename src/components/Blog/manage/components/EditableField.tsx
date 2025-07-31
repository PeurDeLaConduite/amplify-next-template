import React, { ChangeEvent, FocusEvent } from "react";

type EditableFieldProps = {
    label: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    readOnly: boolean;
    name: string;
    onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const EditableField = ({
    label,
    value = "",
    onChange,
    readOnly,
    name,
    onFocus,
    onBlur,
}: EditableFieldProps) => (
    <div style={{ marginBottom: "1rem" }}>
        <label>
            {label}
            <input
                type="text"
                name={name}
                value={value ?? ""}
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                readOnly={readOnly}
                style={{
                    display: "block",
                    width: "100%",
                    padding: "8px",
                    border: readOnly ? "1px solid gray" : "1px solid blue",
                    backgroundColor: readOnly ? "#f4f4f4" : "#fff",
                    borderRadius: "4px",
                }}
            />
        </label>
    </div>
);

export default EditableField;

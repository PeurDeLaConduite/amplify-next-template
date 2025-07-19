import React from "react";

const EditableTextArea = ({ label, value = "", onChange, readOnly, name }) => (
    <div style={{ marginBottom: "1rem" }}>
        <label htmlFor={name} style={{ display: "block", marginBottom: "0.5rem" }}>
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
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

import React from "react";

const EditableField = ({ label, value, onChange, readOnly, name }) => (
    <div style={{ marginBottom: "1rem" }}>
        <label>
            {label}
            <input
                type="text"
                name={name}
                value={value ?? ""}
                onChange={onChange}
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

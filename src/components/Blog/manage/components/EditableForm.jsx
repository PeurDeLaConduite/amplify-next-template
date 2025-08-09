import React, { useState } from "react";
import EditableField from "./EditableField";
import ActionButtons from "./buttons/ActionButtons";

const EditableForm = () => {
    const [form, setForm] = useState({
        seo: {
            image: "https://monblog.com/image.png",
            title: "Titre SEO",
            description: "Description SEO",
        },
    });

    const [isEditing, setIsEditing] = useState(false);
    const [backupForm, setBackupForm] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            seo: {
                ...prev.seo,
                [name]: value,
            },
        }));
    };

    return (
        <div>
            <h2>SEO</h2>
            <EditableField
                label="Image URL"
                name="image"
                value={form.seo.image}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="SEO Title"
                name="title"
                value={form.seo.title}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="SEO Description"
                name="description"
                value={form.seo.description}
                onChange={handleChange}
                readOnly={!isEditing}
            />

            <ActionButtons
                isEditing={isEditing}
                onEdit={() => {
                    setBackupForm(form);
                    setIsEditing(true);
                }}
                onSave={() => {
                    console.log("Enregistrement :", form);
                    setIsEditing(false);
                    setBackupForm(null);
                }}
                onCancel={() => {
                    setForm(backupForm);
                    setIsEditing(false);
                    setBackupForm(null);
                }}
            />
        </div>
    );
};

export default EditableForm;

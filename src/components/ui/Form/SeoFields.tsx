// src/components/ui/form/SeoFields.tsx
import React from "react";
import EditableField from "./EditableField";

type SeoFieldsProps = {
    seo: {
        title: string;
        description: string;
        image: string;
    };
    readOnly: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function SeoFields({ seo, readOnly, onChange }: SeoFieldsProps) {
    return (
        <fieldset className="border p-4 rounded-md mt-4">
            <legend className="text-sm font-medium text-gray-700">SEO</legend>

            <EditableField
                name="seo.title"
                label="SEO Titre"
                value={seo.title}
                onChange={onChange}
                readOnly={readOnly}
            />
            <EditableField
                name="seo.description"
                label="SEO Description"
                value={seo.description}
                onChange={onChange}
                readOnly={readOnly}
            />
            <EditableField
                name="seo.image"
                label="Image SEO (URL)"
                value={seo.image}
                onChange={onChange}
                readOnly={readOnly}
            />
        </fieldset>
    );
}

import React, { useState } from "react";
import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";
import EditableField from "./EditableField";
import EditableTextArea from "./EditableTextArea";
import { DateTimeField } from "./DateTimeField";
import ActionButtons from "./buttons/ActionButtons";

const client = generateClient<Schema>({ authMode: "userPool" });

export default function ArticleEditForm({ post, onSave, onCancel }) {
    // Pré-remplir le formulaire
    const [form, setForm] = useState({
        id: post?.id ?? "",
        slug: post?.slug ?? "",
        title: post?.title ?? "",
        excerpt: post?.excerpt ?? "",
        content: post?.content ?? "",
        status: post?.status ?? "draft",
        videoUrl: post?.videoUrl ?? "",
        subtitleSource: post?.subtitleSource ?? "",
        subtitleDownloaded: post?.subtitleDownloaded ?? false,
        order: post?.order ?? 0,
        type: post?.type ?? "",
        seo: post?.seo ?? { title: "", description: "", image: "" },
        authorId: post?.authorId ?? "",
        createdAt: post?.createdAt ?? "",
        updatedAt: post?.updatedAt ?? "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [backupForm, setBackupForm] = useState(null);
    const [error, setError] = useState(null);

    // Gère tous les changements du formulaire (y compris SEO imbriqué)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // SEO imbriqué
        if (name.startsWith("seo.")) {
            setForm((prev) => ({
                ...prev,
                seo: { ...prev.seo, [name.replace("seo.", "")]: value },
            }));
        } else if (type === "checkbox") {
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDateChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setError(null);
        try {
            // Ajoute d'autres champs ou transformations selon le besoin
            const input = { ...form };
            const { errors } = await client.models.Post.update(input);
            if (errors) throw errors;
            setIsEditing(false);
            setBackupForm(null);
            onSave?.(input);
        } catch (err) {
            setError(Array.isArray(err) ? err.map((e) => e.message).join("\n") : String(err));
        }
    };

    const handleEdit = () => {
        setBackupForm(form);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setForm(backupForm ?? form);
        setIsEditing(false);
        setBackupForm(null);
        onCancel?.();
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
        >
            <EditableField
                label="Slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="Titre"
                name="title"
                value={form.title}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableTextArea
                label="Résumé"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableTextArea
                label="Contenu"
                name="content"
                value={form.content}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="Vidéo URL"
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="Source sous-titres"
                name="subtitleSource"
                value={form.subtitleSource}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <div style={{ margin: "1rem 0" }}>
                <label>
                    <input
                        type="checkbox"
                        name="subtitleDownloaded"
                        checked={form.subtitleDownloaded}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                    Sous-titres téléchargés
                </label>
            </div>
            <EditableField
                label="Ordre"
                name="order"
                value={form.order}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <select name="status" value={form.status} onChange={handleChange} disabled={!isEditing}>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
            </select>

            {/* Champs dates */}
            <DateTimeField
                label="Créé le"
                name="createdAt"
                value={form.createdAt}
                onChange={handleDateChange}
                readOnly
            />
            <DateTimeField
                label="Modifié le"
                name="updatedAt"
                value={form.updatedAt}
                onChange={handleDateChange}
                readOnly
            />

            {/* Bloc SEO */}
            <h3>SEO</h3>
            <EditableField
                label="SEO Title"
                name="seo.title"
                value={form.seo.title}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="SEO Description"
                name="seo.description"
                value={form.seo.description}
                onChange={handleChange}
                readOnly={!isEditing}
            />
            <EditableField
                label="SEO Image"
                name="seo.image"
                value={form.seo.image}
                onChange={handleChange}
                readOnly={!isEditing}
            />

            {error && <div style={{ color: "crimson" }}>{error}</div>}

            <ActionButtons
                isEditing={isEditing}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </form>
    );
}

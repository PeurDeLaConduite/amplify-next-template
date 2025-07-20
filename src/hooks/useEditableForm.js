import { useState } from "react";
import { generateSlug, generateCustomId } from "./utilsFormFn.js";

export default function useEditableForm({
    initialForm,
    items,
    setItems,
    relatedItems, // ex: posts
    setRelatedItems, // ex: setPosts
    itemKey = "id",
    relatedKey = "sectionIds",
    relationKey = "postIds",
    idPrefix = "", // ex: "S", "P" ou "A"
    prepareItem = (item) => item,
    onAdd,
    onUpdate,
    onDelete,
}) {
    const [form, setForm] = useState(initialForm);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [backupForm, setBackupForm] = useState(null);

    // Met à jour slug automatiquement quand on change le titre
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "title") {
            setForm((prev) => {
                const next = { ...prev, title: value };
                // si slug vide ou correspond à l'ancien title slugifié, on le régénère
                if (!prev.slug || prev.slug === generateSlug(prev.title)) {
                    next.slug = generateSlug(value);
                }
                return next;
            });
            return;
        }

        if (name.startsWith("seo.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                seo: { ...prev.seo, [key]: value },
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Gère la liaison bidirectionnelle posts ↔ section
    const handlePostsChange = (selectedIds) => {
        setForm((prev) => ({ ...prev, [relationKey]: selectedIds }));

        const updatedRelated = relatedItems.map((related) => {
            const hasRelation = selectedIds.includes(related.id);
            const alreadyLinked = related[relatedKey].includes(form[itemKey]);

            if (hasRelation && !alreadyLinked) {
                return { ...related, [relatedKey]: [...related[relatedKey], form[itemKey]] };
            }
            if (!hasRelation && alreadyLinked) {
                return {
                    ...related,
                    [relatedKey]: related[relatedKey].filter((id) => id !== form[itemKey]),
                };
            }
            return related;
        });

        setRelatedItems(updatedRelated);
    };

    // Sauvegarde l'item, en générant un ID si besoin
    const handleSave = () => {
        // 1) ID et order auto
        const newId = form.id || generateCustomId(items, idPrefix);
        const newOrder = editingIndex === null ? items.length + 1 : form.order;

        // 2) Dates
        const now = new Date().toISOString();

        // 3) Prépare l’objet complet
        const toSave = prepareItem({
            ...form,
            id: newId,
            order: newOrder,
            createdAt: form.createdAt || now,
            updatedAt: now,
            relatedPostIds: form.relatedPostIds || [], // si nécessaire
        });

        const copy = [...items];
        if (editingIndex !== null) copy[editingIndex] = toSave;
        else copy.push(toSave);

        setItems(copy);
        handleCancel();
        if (editingIndex !== null) {
            onUpdate?.(toSave);
        } else {
            onAdd?.(toSave);
        }
    };

    const handleEdit = (index) => {
        setBackupForm(form);
        setForm(items[index]);
        setEditingIndex(index);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setForm(backupForm || initialForm);
        setEditingIndex(null);
        setIsEditing(false);
        setBackupForm(null);
    };

    const handleDelete = (index) => {
        const toDelete = items[index];
        const updated = items.filter((_, i) => i !== index);
        setItems(updated);
        if (editingIndex === index) handleCancel();
        if (toDelete) {
            onDelete?.(toDelete[itemKey] || toDelete.id);
        }
    };

    const handleReorder = (fromIndex, toPosition) => {
        const copy = [...items];
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(toPosition - 1, 0, moved);
        const reordered = copy.map((item, i) => ({ ...item, order: i + 1 }));
        setItems(reordered);
        if (editingIndex === fromIndex) {
            setForm((prev) => ({ ...prev, order: toPosition }));
            setEditingIndex(toPosition - 1);
        }
    };

    return {
        form,
        setForm,
        editingIndex,
        isEditing,
        handleChange,
        handleSave,
        handleEdit,
        handleCancel,
        handleDelete,
        handleReorder,
        handlePostsChange,
    };
}

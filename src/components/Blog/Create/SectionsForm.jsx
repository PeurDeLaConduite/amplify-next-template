// src/components/Blog/Create/SectionsForm.jsx
"use client";

import React from "react";
import EditableField from "./components/EditableField";
import SeoFields from "./components/SeoFields";
import FormActionButtons from "./FormActionButtons";
import useEditableForm from "@/src/hooks/useEditableForm";
import OrderSelector from "./components/OrderSelector";
import ItemSelector from "./components/ItemSelector";

export default function SectionsForm({ sections, setSections, posts, setPosts }) {
    const initialForm = {
        id: "",
        slug: "",
        title: "",
        description: "",
        order: 1,
        postIds: [],
        seo: { title: "", description: "", image: "" },
    };

    const {
        form,
        editingIndex,
        isEditing,
        handleChange,
        handleSave,
        handleEdit,
        handleCancel,
        handleDelete,
        handleReorder,
        handlePostsChange, // gère postIds ↔ sectionIds bidirectionnel
    } = useEditableForm({
        initialForm,
        items: sections,
        setItems: setSections,
        relatedItems: posts,
        setRelatedItems: setPosts,
        itemKey: "id",
        relatedKey: "sectionIds", // dans posts
        relationKey: "postIds", // dans sections
        idPrefix: "S", // génère S1, S2, ...
        prepareItem: (item) => ({
            ...item,
            postIds: Array.isArray(item.postIds)
                ? item.postIds
                : item.postIds.split(",").map(Number),
            order: Number(item.order),
        }),
    });

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Sections</h2>

            <form onSubmit={(e) => e.preventDefault()} className="grid gap-2">
                {/* ID & Slug automatiques */}
                <EditableField
                    name="id"
                    label="ID"
                    value={form.id}
                    onChange={handleChange}
                    readOnly
                />
                <EditableField
                    name="slug"
                    label="Slug"
                    value={form.slug}
                    onChange={handleChange}
                    readOnly
                />

                {/* Titre -> met à jour le slug automatiquement */}
                <EditableField
                    name="title"
                    label="Titre"
                    value={form.title}
                    onChange={handleChange}
                    readOnly={false}
                />

                <EditableField
                    name="description"
                    label="Description"
                    value={form.description}
                    onChange={handleChange}
                    readOnly={false}
                />

                {/* Gestion de l’ordre */}
                <OrderSelector
                    sections={sections}
                    currentIndex={editingIndex === null ? sections.length : editingIndex}
                    value={form.order}
                    onReorder={handleReorder}
                />

                {/* Blocs SEO */}
                <SeoFields seo={form.seo} readOnly={!isEditing} onChange={handleChange} />

                {/* Sélection des articles associés */}
                <ItemSelector
                    items={posts}
                    selectedIds={form.postIds}
                    onChange={handlePostsChange}
                    label="Articles associés :"
                />

                {/* Bouton Ajouter (uniquement si création) */}
                {editingIndex === null && (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Ajouter la section
                    </button>
                )}
            </form>

            {/* Liste des sections existantes */}
            <ul className="mt-6 space-y-2">
                {sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, idx) => {
                        const active = editingIndex === idx;
                        return (
                            <li
                                key={section.id}
                                className={`flex justify-between items-center p-2 transition-colors duration-300 ${
                                    active ? "bg-yellow-100 shadow-sm" : "border-b"
                                }`}
                            >
                                <div>
                                    <strong>{section.title}</strong> (ordre&nbsp;: {section.order})
                                </div>
                                <FormActionButtons
                                    editingIndex={editingIndex}
                                    currentIndex={idx}
                                    onEdit={() => handleEdit(idx)}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    onDelete={() => handleDelete(idx)}
                                />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}

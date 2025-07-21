"use client";

import React, { useState } from "react";
import { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import EditableField from "./components/EditableField";
import SeoFields from "./components/SeoFields";
import FormActionButtons from "./FormActionButtons";
import OrderSelector from "./components/OrderSelector";
import ItemSelector from "./components/ItemSelector";
type Section = Schema["Section"]["type"];

interface SectionsFormProps {
    sections?: Section[];
    posts: Schema["Post"]["type"][];
    onAdd: (form: SectionForm) => Promise<Section>;
    onUpdate: (id: string, form: SectionForm) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    client: ReturnType<typeof generateClient<Schema>>;
}

interface SectionForm {
    slug: string;
    title: string;
    description: string;
    order: number;
    seo: {
        title: string;
        description: string;
        image: string;
    };
    postIds: string[];
}

const initialForm: SectionForm = {
    slug: "",
    title: "",
    description: "",
    order: 1,
    seo: { title: "", description: "", image: "" },
    postIds: [],
};

export default function SectionsForm({
    sections = [],
    posts,
    onAdd,
    onUpdate,
    onDelete,
    client,
}: SectionsFormProps) {
    const [form, setForm] = useState<SectionForm>(initialForm);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    // 🟢 handleChange pour tout sauf postIds
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1];
            setForm((f) => ({
                ...f,
                seo: { ...f.seo, [key]: value },
            }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };
    // 🟢 Edition : charger les articles liés
    const handleEdit = async (idx: number) => {
        setEditingIndex(idx);
        const s = sections[idx];
        // Charge SectionPost pour cette section
        const { data: links } = await client.models.SectionPost.list({
            filter: { sectionId: { eq: s.id } },
        });
        const postIds = links.map((l) => l.postId);
        setForm({
            slug: s.slug || "",
            title: s.title || "",
            description: s.description || "",
            order: s.order || 1,
            seo: {
                title: s.seo?.title ?? "",
                description: s.seo?.description ?? "",
                image: s.seo?.image ?? "",
            },
            postIds,
        });
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setForm(initialForm);
    };

    // 🟢 Gestion relation N:N Section-Post lors du save
    const handleSave = async () => {
        setSaving(true);
        if (!form.title) return;
        if (editingIndex === null) {
            // ADD
            const section = await onAdd(form);
            // Ajout relations
            for (const postId of form.postIds) {
                await client.models.SectionPost.create({ sectionId: section.id, postId });
            }
        } else {
            // UPDATE
            const id = sections[editingIndex].id;
            await onUpdate(id, form);
            // Synchronise relations
            const { data: links } = await client.models.SectionPost.list({
                filter: { sectionId: { eq: id } },
            });
            const currentIds = links.map((l) => l.postId);
            const idsToAdd = form.postIds.filter((pid) => !currentIds.includes(pid));
            const idsToRemove = currentIds.filter((pid) => !form.postIds.includes(pid));
            // Ajout des nouveaux liens
            for (const postId of idsToAdd) {
                await client.models.SectionPost.create({ sectionId: id, postId });
            }
            // Suppression des liens retirés
            for (const postId of idsToRemove) {
                await client.models.SectionPost.delete({ sectionId: id, postId });
            }
        }
        setSaving(false);
        handleCancel();
    };

    const handleDeleteLocal = (idx: number) => {
        if (sections[idx]?.id) {
            onDelete(sections[idx].id);
        }
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Sections</h2>
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-2">
                <EditableField
                    name="title"
                    label="Titre"
                    value={form.title}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableField
                    name="slug"
                    label="Slug"
                    value={form.slug}
                    onChange={handleChange}
                    readOnly={false}
                />
                <EditableField
                    name="description"
                    label="Description"
                    value={form.description}
                    readOnly={false}
                    onChange={handleChange}
                />
                <OrderSelector
                    sections={sections}
                    currentIndex={editingIndex === null ? sections.length : editingIndex}
                    value={form.order}
                    onReorder={(index: number, newOrder: number) => {
                        setForm((f) => ({ ...f, order: newOrder }));
                    }}
                />
                <SeoFields seo={form.seo} readOnly={false} onChange={handleChange} />

                {/* 🟢 Lien N:N */}
                <ItemSelector
                    items={posts}
                    idKey="id"
                    selectedIds={form.postIds}
                    onChange={(postIds) => setForm((f) => ({ ...f, postIds }))}
                    label="Articles associés :"
                    getLabel={(post) => post.title}
                />

                {editingIndex === null && (
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Ajouter la section
                    </button>
                )}
            </form>

            <ul className="mt-6 space-y-2">
                {sections
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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
                                    <strong>{section.title}</strong> (ordre : {section.order})
                                </div>
                                <FormActionButtons
                                    editingIndex={editingIndex}
                                    currentIndex={idx}
                                    onEdit={() => handleEdit(idx)}
                                    onSave={handleSave}
                                    onCancel={handleCancel}
                                    onDelete={() => handleDeleteLocal(idx)}
                                    isFormNew={false}
                                />
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}

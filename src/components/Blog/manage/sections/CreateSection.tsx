"use client";

import React, { useEffect, useState, useRef } from "react";
import RequireAdmin from "@components/RequireAdmin";
import SectionForm from "./SectionsForm";
import SectionList from "./SectionList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import { sectionService } from "@entities/models/section/service";
import { type SectionTypes, initialSectionForm, useSectionForm } from "@entities/models/section";

export default function SectionManagerPage() {
    const [editingSection, setEditingSection] = useState<SectionTypes | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useSectionForm(editingSection);
    const {
        extras: { sections },
        fetchSections,
        setForm,
        setMode,
    } = manager;

    useEffect(() => {
        fetchSections();
    }, [fetchSections]);

    const handleEdit = (idx: number) => {
        setEditingSection(sections[idx]);
        setEditingIndex(idx);
    };

    const handleDelete = async (idx: number) => {
        if (!confirm("Supprimer cette section ?")) return;
        const id = sections[idx].id;
        await sectionService.delete({ id });
        await fetchSections();
    };

    const handleSave = async () => {
        await fetchSections();
        setEditingSection(null);
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingSection(null);
        setEditingIndex(null);
        setMode("create");
        setForm(initialSectionForm);
    };

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Sections">
                <SectionForm
                    ref={formRef}
                    manager={manager}
                    editingIndex={editingIndex}
                    onSave={handleSave}
                />
                <SectionList
                    sections={sections}
                    editingIndex={editingIndex}
                    onEdit={handleEdit}
                    onSave={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

"use client";

import React, { useEffect, useState, useRef } from "react";
import RequireAdmin from "@components/RequireAdmin";
import SectionForm from "./SectionsForm";
import SectionList from "./SectionList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { type SectionTypes, initialSectionForm, useSectionForm } from "@entities/models/section";

export default function SectionManagerPage() {
    const [editingSection, setEditingSection] = useState<SectionTypes | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useSectionForm(editingSection);
    const {
        extras: { sections },
        fetchList,
        remove,
        setForm,
        setMode,
    } = manager;

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const handleEditById = (id: string) => {
        const idx = sections.findIndex((s) => s.id === id);
        if (idx === -1) return;
        setEditingSection(sections[idx]);
        setEditingId(id);
    };

    const handleDeleteById = async (id: string) => {
        const idx = sections.findIndex((s) => s.id === id);
        if (idx === -1) return;
        await remove(idx);
    };

    const handleSave = async () => {
        await fetchList();
        setEditingSection(null);
        setEditingId(null);
    };

    const handleCancel = () => {
        setEditingSection(null);
        setEditingId(null);
        setMode("create");
        setForm(initialSectionForm);
    };

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Sections">
                <SectionHeader className="mt-8">Nouvelle section</SectionHeader>
                <SectionForm
                    ref={formRef}
                    manager={manager}
                    editingIndex={
                        editingId !== null ? sections.findIndex((s) => s.id === editingId) : null
                    }
                    onSave={handleSave}
                />
                <SectionHeader>Liste des sections</SectionHeader>
                <SectionList
                    sections={sections}
                    editingId={editingId}
                    onEditById={handleEditById}
                    onSave={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

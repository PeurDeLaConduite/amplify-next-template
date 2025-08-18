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
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
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

    const handleEdit = (idx: number) => {
        setEditingSection(sections[idx]);
        setEditingIndex(idx);
    };

    const handleDelete = async (idx: number) => {
        await remove(idx);
    };

    const handleSave = async () => {
        await fetchList();
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
                <SectionHeader className="mt-8">Nouvelle section</SectionHeader>
                <SectionForm
                    ref={formRef}
                    manager={manager}
                    editingIndex={editingIndex}
                    onSave={handleSave}
                />
                <SectionHeader>Liste des sections</SectionHeader>
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

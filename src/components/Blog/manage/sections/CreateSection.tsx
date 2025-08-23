"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import RequireAdmin from "@components/RequireAdmin";
import SectionForm from "./SectionsForm";
import SectionList from "./SectionList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { type SectionType, initialSectionForm, useSectionForm } from "@entities/models/section";

type IdLike = string | number;

export default function SectionManagerPage() {
    const [editingSection, setEditingSection] = useState<SectionType | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useSectionForm(editingSection);
    const {
        extras: { sections },
        listSections,
        selectById,
        removeById,
        setForm,
        setMode,
    } = manager;

    useEffect(() => {
        listSections();
    }, [listSections]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const section = selectById(String(id));
            if (!section) return;
            setEditingSection(section);
            setEditingId(String(id));
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
        },
        [removeById]
    );

    const handleUpdate = useCallback(async () => {
        await listSections();
        setEditingSection(null);
        setEditingId(null);
    }, [listSections]);

    const handleCancel = useCallback(() => {
        setEditingSection(null);
        setEditingId(null);
        setMode("create");
        setForm(initialSectionForm);
    }, [setMode, setForm]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Sections">
                <SectionHeader className="mt-8">Nouvelle section</SectionHeader>
                <SectionForm
                    ref={formRef}
                    sectionFormManager={manager}
                    editingId={editingId}
                    onSaveSuccess={handleUpdate}
                />
                <SectionHeader>Liste des sections</SectionHeader>
                <SectionList
                    sections={sections}
                    editingId={editingId}
                    onEditById={handleEditById}
                    onUpdate={() => {
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

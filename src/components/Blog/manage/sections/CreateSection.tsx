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
    const [sectionToEdit, setSectionToEdit] = useState<SectionType | null>(null);
    const [sectionId, setSectionId] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useSectionForm(sectionToEdit);
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
            setSectionToEdit(section);
            setSectionId(String(id));
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
        setSectionToEdit(null);
        setSectionId(null);
    }, [listSections]);

    const handleCancel = useCallback(() => {
        setSectionToEdit(null);
        setSectionId(null);
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
                    sectionId={sectionId}
                    onSaveSuccess={handleUpdate}
                />
                <SectionHeader>Liste des sections</SectionHeader>
                <SectionList
                    sections={sections}
                    sectionId={sectionId}
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

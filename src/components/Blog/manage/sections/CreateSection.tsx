// src/components/Blog/manage/posts/CreatePost.tsx (refactored)
"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import SectionList from "./SectionList";
import SectionForm from "./SectionsForm";
import RequireAdmin from "@components/RequireAdmin";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { type SectionType, useSectionForm } from "@entities/models/section";

type IdLike = string | number;

export default function SectionManagerPage() {
    const [sectionToEdit, setSectionToEdit] = useState<SectionType | null>(null);
    const sectionId = sectionToEdit?.id ?? null;
    const formRef = useRef<HTMLFormElement>(null);

    const manager = useSectionForm(sectionToEdit);
    const {
        extras: { sections },
        listSections,
        selectById,
        removeById,
    } = manager;

    useEffect(() => {
        void listSections();
    }, [listSections]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            const section = selectById(String(id)); // gère déjà l'ID + mode "edit" côté hook
            if (section) setSectionToEdit(section);
        },
        [selectById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await removeById(String(id));
        },
        [removeById]
    );

    const handleSaved = useCallback(async () => {
        await listSections();
        setSectionToEdit(null); // rien d'autre à nettoyer
    }, [listSections]);

    const handleCancel = useCallback(() => {
        setSectionToEdit(null);
    }, []);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Sections">
                <SectionHeader className="mt-8">Nouvelle section</SectionHeader>
                <SectionForm
                    ref={formRef}
                    sectionFormManager={manager}
                    sections={sections}
                    editingId={sectionId}
                    onSaveSuccess={handleSaved}
                />

                <SectionHeader>Liste des sections</SectionHeader>
                <SectionList
                    sections={sections}
                    sectionId={sectionId} // idem
                    onEditById={handleEditById}
                    onUpdate={() => formRef.current?.requestSubmit()}
                    onCancel={handleCancel}
                    onDeleteById={handleDeleteById}
                />
            </BlogEditorLayout>
        </RequireAdmin>
    );
}

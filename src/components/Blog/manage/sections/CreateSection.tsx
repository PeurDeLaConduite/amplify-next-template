"use client";

import React, { useEffect, useRef, useCallback } from "react";
import RequireAdmin from "@components/RequireAdmin";
import SectionForm from "./SectionsForm";
import SectionList from "./SectionList";
import BlogEditorLayout from "@components/Blog/manage/BlogEditorLayout";
import SectionHeader from "@components/Blog/manage/SectionHeader";
import { useSectionManager } from "@entities/models/section";

type IdLike = string | number;

export default function SectionManagerPage() {
    const formRef = useRef<HTMLFormElement>(null);
    const manager = useSectionManager();
    const {
        entities: sections,
        refresh,
        loadEntityById,
        deleteById,
        editingId,
        cancelEdit,
    } = manager;

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const handleEditById = useCallback(
        (id: IdLike) => {
            void loadEntityById(String(id));
        },
        [loadEntityById]
    );

    const handleDeleteById = useCallback(
        async (id: IdLike) => {
            await deleteById(String(id));
        },
        [deleteById]
    );

    const handleSave = useCallback(async () => {
        await refresh();
    }, [refresh]);

    const handleCancel = useCallback(() => {
        cancelEdit();
    }, [cancelEdit]);

    return (
        <RequireAdmin>
            <BlogEditorLayout title="Gestion des Sections">
                <SectionHeader className="mt-8">Nouvelle section</SectionHeader>
                <SectionForm
                    ref={formRef}
                    manager={manager}
                    editingId={editingId}
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

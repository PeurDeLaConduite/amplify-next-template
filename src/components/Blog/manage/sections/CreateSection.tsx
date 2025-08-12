"use client";

import React, { useEffect, useState, useRef } from "react";
import RequireAdmin from "@components/RequireAdmin";
import SectionForm from "./SectionsForm";
import SectionList from "./SectionList";
import { sectionService } from "@entities/models/section/service";
import { type SectionTypes } from "@entities/models/section/types";

export default function SectionManagerPage() {
    const [sections, setSections] = useState<SectionTypes[]>([]);
    const [editingSection, setEditingSection] = useState<SectionTypes | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fetchSections = async () => {
        const { data } = await sectionService.list();
        setSections(data ?? []);
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleEdit = (id: string) => {
        const section = sections.find((s) => s.id === id) ?? null;
        setEditingSection(section);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette section ?")) return;
        await sectionService.delete({ id });
        await fetchSections();
    };

    const handleSave = () => {
        fetchSections();
        setEditingSection(null);
    };

    const handleCancel = () => {
        setEditingSection(null);
    };

    return (
        <RequireAdmin>
            <div className="p-4">
                <h1 className="text-2xl font-bold">Gestion des Sections</h1>
                <SectionForm
                    ref={formRef}
                    section={editingSection}
                    sections={sections}
                    onSave={handleSave}
                />
                <SectionList
                    sections={sections}
                    editingId={editingSection?.id ?? null}
                    onEdit={handleEdit}
                    onSave={() => {
                        // Appelle le submit du formulaire via la ref
                        formRef.current?.requestSubmit();
                    }}
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                />
            </div>
        </RequireAdmin>
    );
}

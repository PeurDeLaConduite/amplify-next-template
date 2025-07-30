"use client";

import React, { useEffect, useState, useRef } from "react";
import RequireAdmin from "@/src/components/RequireAdmin";
import { client } from "@/src/services/amplifyClient";
import SectionForm from "./SectionsForm";
import SectionList from "./SectionList";
import type { Section } from "@/src/types";

export default function SectionManagerPage() {
    const [sections, setSections] = useState<Section[]>([]);
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fetchSections = async () => {
        const { data } = await client.models.Section.list();
        setSections(data ?? []);
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const handleEdit = (idx: number) => {
        setEditingSection(sections[idx]);
        setEditingIndex(idx);
    };

    const handleDelete = async (idx: number) => {
        if (!confirm("Supprimer cette section ?")) return;
        const id = sections[idx].id;
        await client.models.Section.delete({ id });
        await fetchSections();
    };

    const handleSave = () => {
        fetchSections();
        setEditingSection(null);
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingSection(null);
        setEditingIndex(null);
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
                    editingIndex={editingIndex}
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

// src/components/Blog/manage/SectionList.tsx
"use client";

import React from "react";
import GenericList from "../GenericList";
import { byOptionalOrder } from "../sorters";
import { type SectionTypes } from "@entities/models/section";

interface Props {
    sections: SectionTypes[];
    editingIndex: number | null;
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;
}

export default function SectionList(props: Props) {
    return (
        <GenericList<SectionTypes>
            items={props.sections}
            editingIndex={props.editingIndex}
            getKey={(s) => s.id}
            renderContent={(s) => (
                <p className="self-center">
                    <strong>{s.title}</strong> (ordre : {s.order})
                </p>
            )}
            sortBy={byOptionalOrder}
            onEdit={props.onEdit}
            onSave={props.onSave}
            onCancel={props.onCancel}
            onDelete={props.onDelete}
        />
    );
}

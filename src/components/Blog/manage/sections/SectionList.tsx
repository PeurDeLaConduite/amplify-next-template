"use client";

import React from "react";
import GenericList from "@components/Blog/manage/GenericList";
import { byOptionalOrder } from "@components/Blog/manage/sorters";
import { type SectionType } from "@entities/models/section";

type IdLike = string | number;

interface Props {
    sections: SectionType[];
    editingId: IdLike | null;
    enterEditModeById: (id: IdLike) => void;
    requestSubmit: () => void;
    onCancel: () => void;
    onDeleteById: (id: IdLike) => void;
    onRequestSubmit?: () => void;
}

export default function SectionList(props: Props) {
    return (
        <GenericList<SectionType>
            items={props.sections}
            editingId={props.editingId}
            getId={(s) => s.id}
            renderContent={(s) => (
                <p className="self-center">
                    <strong>{s.title}</strong> (ordre : {s.order})
                </p>
            )}
            sortBy={byOptionalOrder}
            enterEditModeById={props.enterEditModeById}
            requestSubmit={props.requestSubmit}
            onRequestSubmit={props.onRequestSubmit}
            onCancel={props.onCancel}
            onDeleteById={props.onDeleteById}
        />
    );
}

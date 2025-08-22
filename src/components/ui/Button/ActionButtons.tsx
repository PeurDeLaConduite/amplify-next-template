import React from "react";
import { EditButton, UpdateButton, CancelButton } from "@components/ui/Button";

type ActionButtonsProps = {
    isEditing: boolean;
    onEdit: () => void;
    onUpdate: () => void;
    onCancel: () => void;
    className?: string;
};

const ActionButtons = ({
    isEditing,
    onEdit,
    onUpdate,
    onCancel,
    className = "",
}: ActionButtonsProps) => {
    return (
        <div className={className} style={{ display: "flex", gap: "0.5rem" }}>
            {!isEditing && <EditButton onEdit={onEdit} label="Modifier" size="small" />}
            {isEditing && (
                <>
                    <UpdateButton onUpdate={onUpdate} label="Enregistrer" size="small" />
                    <CancelButton onCancel={onCancel} label="Annuler" size="small" />
                </>
            )}
        </div>
    );
};

export default ActionButtons;

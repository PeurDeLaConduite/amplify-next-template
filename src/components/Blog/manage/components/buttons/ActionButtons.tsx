import React from "react";
import { EditButton, SaveButton, CancelButton } from "@components/ui/Button";

type ActionButtonsProps = {
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    className?: string;
};

const ActionButtons = ({
    isEditing,
    onEdit,
    onSave,
    onCancel,
    className = "",
}: ActionButtonsProps) => {
    return (
        <div className={className} style={{ display: "flex", gap: "0.5rem" }}>
            {!isEditing && <EditButton onClick={onEdit} label="Modifier" size="small" />}
            {isEditing && (
                <>
                    <SaveButton onClick={onSave} label="Enregistrer" size="small" />
                    <CancelButton onClick={onCancel} label="Annuler" size="small" />
                </>
            )}
        </div>
    );
};

export default ActionButtons;

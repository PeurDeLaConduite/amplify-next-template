import ActionButtons from "./buttons/ActionButtons";
import { EditButton, DeleteButton, ButtonBase } from "@components/ui/Button";
type IdLike = string | number;

interface FormActionButtonsProps {
    editingId: IdLike | null;
    currentId: IdLike;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
    isFormNew: boolean;
    addButtonLabel?: string;
    className?: string;
    variant?: "no-Icon" | "normal";
    editButtonLabel?: string;
    deleteButtonLabel?: string;
}

export default function FormActionButtons({
    editingId,
    currentId,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    isFormNew,
    addButtonLabel = "Ajouter",
    className = "",
    variant = "normal",
    editButtonLabel,
    deleteButtonLabel,
}: FormActionButtonsProps): React.ReactElement {
    if (isFormNew && editingId === null) {
        return (
            <button
                type="button"
                onClick={onSave}
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
                {addButtonLabel}
            </button>
        );
    }

    if (editingId === currentId) {
        return (
            <ActionButtons
                isEditing={true}
                onEdit={onEdit}
                onSave={onSave}
                onCancel={onCancel}
                className={className}
            />
        );
    }

    const miniButtonSx = {
        borderColor: "#bbb",
        minHeight: 32,
        borderRadius: 2,
        fontSize: 14,
        fontWeight: 400,
        transition: "all .15s",
    };

    if (variant === "no-Icon") {
        return (
            <div className="flex gap-2">
                <ButtonBase
                    label="Modifier"
                    onClick={onEdit}
                    size="small"
                    variant="outlined"
                    sx={miniButtonSx}
                />
                <ButtonBase
                    label="Supprimer"
                    onClick={onDelete}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={miniButtonSx}
                />
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <EditButton
                onClick={onEdit}
                className="!p-2 !h-8"
                color="#1976d2"
                label={editButtonLabel}
                size="small"
            />
            <DeleteButton
                onClick={onDelete}
                className="!p-2 !h-8"
                label={deleteButtonLabel}
                size="small"
            />
        </div>
    );
}

import { ActionButtons, EditButton, DeleteButton, UiButton } from "@components/ui/Button";
type IdLike = string | number;

interface FormActionButtonsProps {
    editingId: IdLike | null;
    currentId: IdLike;
    onEdit: () => void;
    onUpdate: () => void;
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
    onUpdate,
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
                onClick={onUpdate}
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
                onUpdate={onUpdate}
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
                <UiButton
                    variantType="button"
                    label="Modifier"
                    variant="outlined"
                    intent="primary"
                    size="small"
                    sx={miniButtonSx}
                    buttonProps={{ onClick: onEdit }}
                />
                <UiButton
                    variantType="button"
                    label="Supprimer"
                    variant="outlined"
                    intent="danger"
                    size="small"
                    sx={miniButtonSx}
                    buttonProps={{ onClick: onDelete }}
                />
            </div>
        );
    }

    return (
        <div className="flex gap-2">
            <EditButton
                onEdit={onEdit}
                className="!p-2 !h-8"
                label={editButtonLabel}
                size="small"
            />
            <DeleteButton
                onDelete={onDelete}
                className="!p-2 !h-8"
                label={deleteButtonLabel}
                size="small"
            />
        </div>
    );
}

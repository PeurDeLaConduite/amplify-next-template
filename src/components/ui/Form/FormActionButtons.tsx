import { ActionButtons, EditButton, DeleteButton, UpdateButton } from "@components/ui/Button";
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
    variantIcon?: "icon" | "normal";
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
    variantIcon,
    editButtonLabel,
    deleteButtonLabel,
}: FormActionButtonsProps): React.ReactElement {
    if (isFormNew && editingId === null) {
        return (
            <UpdateButton
                onUpdate={onUpdate}
                className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                label={addButtonLabel}
            />
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
    if (variantIcon === "icon") {
        return (
            <div className="flex gap-2">
                <EditButton
                    onEdit={onEdit}
                    className="!p-2 !h-8"
                    label={editButtonLabel}
                    size="small"
                    variantType="icon"
                />
                <DeleteButton
                    onDelete={onDelete}
                    className="!p-2 !h-8"
                    label={deleteButtonLabel}
                    size="small"
                    variantType="icon"
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

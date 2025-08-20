import ActionButtons from "./buttons/ActionButtons";
import { EditButton, DeleteButton, AddButton } from "@components/buttons";

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
}: FormActionButtonsProps): React.ReactElement {
    if (isFormNew && editingId === null) {
        return <AddButton onClick={onSave} label={addButtonLabel} className="!p-2 !h-8" />;
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

    return (
        <div className="flex gap-2 ">
            <EditButton onClick={onEdit} className="!p-2 !h-8" color="#1976d2" label="Modifier" />
            <DeleteButton onClick={onDelete} className="!p-2 !h-8" label="Supprimer" />
        </div>
    );
}

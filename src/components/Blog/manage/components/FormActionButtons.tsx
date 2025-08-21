import ActionButtons from "./buttons/ActionButtons";
import { EditButton, DeleteButton } from "@components/buttons";
import ButtonBase from "@components/buttons/ButtonBase";
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

    return (
        <>
            <div className="flex gap-2 ">
                <EditButton
                    onClick={onEdit}
                    className="!p-2 !h-8"
                    color="#1976d2"
                    label="Modifier"
                />
                <DeleteButton onClick={onDelete} className="!p-2 !h-8" label="Supprimer" />
            </div>
            <div className="flex gap-2 ">
                <ButtonBase
                    label="Modifier"
                    onClick={onEdit}
                    color={onClick() ? "primary" : "inherit"}
                    variant={onClick() ? "contained" : "outlined"}
                    sx={{
                        fontWeight: onClick() ? 700 : 400,
                        opacity: onClick() ? 1 : 0.7,
                        borderColor: "#bbb",
                        minHeight: 32,
                        borderRadius: 2,
                        fontSize: 14,
                        transition: "all .15s",
                    }}
                />
                <ButtonBase
                    label="Supprimer"
                    onClick={onDelete}
                    color={onClick() ? "primary" : "inherit"}
                    variant={onClick() ? "contained" : "outlined"}
                    sx={{
                        fontWeight: onClick() ? 700 : 400,
                        opacity: onClick() ? 1 : 0.7,
                        borderColor: "#bbb",
                        minHeight: 32,
                        borderRadius: 2,
                        fontSize: 14,
                        transition: "all .15s",
                    }}
                />
            </div>
        </>
    );
}

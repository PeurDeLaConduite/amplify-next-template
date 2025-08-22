// src/components/ui/button/Buttons.tsx
import { UiButton } from "./UiButton";
import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Backspace as BackspaceIcon,
    PowerSettingsNew as PowerIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import type { ButtonProps as MuiButtonProps, SxProps, Theme } from "@mui/material";

// Props communs exposés par les wrappers
export type ButtonWrapperProps = {
    label?: string;
    title?: string;
    className?: string;
    sx?: SxProps<Theme>;
    size?: MuiButtonProps["size"];
};

export type EditButtonProps = ButtonWrapperProps & { onEdit: () => void };
export function EditButton({
    onEdit,
    label = "Modifier",
    title = "Modifier",
    className,
    sx,
    size,
}: EditButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<EditIcon fontSize="small" />}
            intent="primary"
            variant="outlined"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onEdit }}
        />
    );
}

export type DeleteButtonProps = ButtonWrapperProps & { onDelete: () => void };
export function DeleteButton({
    onDelete,
    label = "Supprimer",
    title = "Supprimer",
    className,
    sx,
    size,
}: DeleteButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<DeleteIcon fontSize="small" />}
            intent="danger"
            variant="outlined"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onDelete }}
        />
    );
}

export type CancelButtonProps = ButtonWrapperProps & { onCancel: () => void };
export function CancelButton({
    onCancel,
    label = "Annuler",
    title = "Annuler",
    className,
    sx,
    size,
}: CancelButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<CancelIcon />}
            intent="ghost"
            variant="outlined"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onCancel }}
        />
    );
}

export type AddButtonProps = ButtonWrapperProps & { onAdd: () => void };
export function AddButton({
    onAdd,
    label = "Ajouter",
    title = "Ajouter",
    className,
    sx,
    size,
}: AddButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<AddIcon />}
            intent="success"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onAdd }}
        />
    );
}

export type SubmitButtonProps = ButtonWrapperProps & { onSubmit: () => void };
export function SubmitButton({
    onSubmit,
    label = "Créer",
    title = "Créer",
    className,
    sx,
    size,
}: SubmitButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<SaveIcon />}
            intent="primary"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onSubmit }}
        />
    );
}

export type UpdateButtonProps = ButtonWrapperProps & { onUpdate: () => void };
export function UpdateButton({
    onUpdate,
    label = "Enregistrer",
    title = "Enregistrer",
    className,
    sx,
    size,
}: UpdateButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<SaveIcon />}
            intent="primary"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onUpdate }}
        />
    );
}

export type ClearFieldButtonProps = ButtonWrapperProps & { onClear: () => void };
export function ClearFieldButton({
    onClear,
    label = "Vider le champ",
    title = "Vider le champ",
    className,
    sx,
    size,
}: ClearFieldButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<BackspaceIcon />}
            intent="warning"
            variant="outlined"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onClear }}
        />
    );
}

export type PowerButtonProps = ButtonWrapperProps & { onPowerOff: () => void };
export function PowerButton({
    onPowerOff,
    label = "Déconnexion",
    title = "Déconnexion",
    className,
    sx,
    size,
}: PowerButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<PowerIcon />}
            intent="danger"
            variant="outlined"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onPowerOff }}
        />
    );
}

export type RefreshButtonProps = ButtonWrapperProps & { onRefresh: () => void };
export function RefreshButton({
    onRefresh,
    label = "Rafraîchir la page",
    title = "Rafraîchir la page",
    className,
    sx,
    size,
}: RefreshButtonProps) {
    return (
        <UiButton
            variantType="button"
            label={label}
            title={title}
            icon={<RefreshIcon />}
            intent="primary"
            className={className}
            sx={sx}
            size={size}
            buttonProps={{ onClick: onRefresh }}
        />
    );
}

export type BackButtonProps = ButtonWrapperProps &
    ({ href: string; onBack?: never } | { onBack: () => void; href?: never });
export function BackButton({
    label = "Retour",
    title = "Retour",
    className,
    sx,
    size,
    ...rest
}: BackButtonProps) {
    const common = {
        variantType: "button" as const,
        label,
        title,
        icon: <ArrowBackIcon />,
        intent: "primary" as const,
        className,
        sx,
        size,
    };
    if ("href" in rest) return <UiButton {...common} href={rest.href} />;
    return <UiButton {...common} buttonProps={{ onClick: rest.onBack }} />;
}

// components/buttons/Buttons.tsx
import ButtonBase, { ButtonBaseProps } from "./ButtonBase";
import { deleteButtonStyles, getEditButtonStyles } from "./buttonStyles";

import {
    Save as SaveIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Cancel as CancelIcon,
    Add as AddIcon,
    Send as SendIcon,
    Backspace as BackspaceIcon,
    ArrowBack as ArrowBackIcon,
    PowerSettingsNew as PowerIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";

import type { ButtonProps as MuiButtonProps, SxProps, Theme } from "@mui/material";
export type BackButtonProps = Pick<ButtonBaseProps, "href" | "label" | "className" | "sx" | "size">;
type ButtonProps = {
    onClick: () => void;
    href?: string;
    label?: string;
    className?: string;
    sx?: SxProps<Theme>;
    size?: MuiButtonProps["size"];
    color?: string;
};

export function EditButton({ onClick, label, className, color, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Modifier"
            onClick={onClick}
            icon={<EditIcon fontSize="small" />}
            className={className}
            variant="outlined"
            size={size}
            sx={{ ...getEditButtonStyles(color), ...(sx as object) }}
        />
    );
}

export function DeleteButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Supprimer"
            onClick={onClick}
            icon={<DeleteIcon fontSize="small" />}
            color="error"
            className={className}
            variant="outlined"
            size={size}
            sx={{ ...deleteButtonStyles, ...(sx as object) }}
        />
    );
}

export function BackButton({
    href,
    onClick,
    label = "Retour",
    className,
    sx = {},
    size,
}: ButtonBaseProps) {
    return (
        <ButtonBase
            href={href}
            onClick={onClick}
            label={label}
            title="Retour"
            icon={<ArrowBackIcon />}
            color="primary"
            variant="contained"
            className={className}
            sx={sx}
            size={size}
        />
    );
}
export function SaveButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Enregistrer"
            onClick={onClick}
            icon={<SaveIcon />}
            color="primary"
            className={className}
            variant="contained"
            size={size}
            sx={sx}
        />
    );
}

export function CancelButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Annuler"
            onClick={onClick}
            icon={<CancelIcon />}
            color="inherit"
            className={className}
            variant="outlined"
            size={size}
            sx={sx}
        />
    );
}

export function AddButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Ajouter"
            onClick={onClick}
            icon={<AddIcon />}
            color="success"
            className={className}
            variant="contained"
            size={size}
            sx={sx}
        />
    );
}

export function SubmitButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Envoyer"
            onClick={onClick}
            icon={<SendIcon />}
            color="primary"
            className={className}
            variant="contained"
            size={size}
            sx={sx}
        />
    );
}

export function ClearFieldButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Vider le champ"
            onClick={onClick}
            icon={<BackspaceIcon />}
            color="warning"
            className={className}
            variant="outlined"
            size={size}
            sx={sx}
        />
    );
}
export function PowerButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Déconnexion"
            onClick={onClick}
            icon={<PowerIcon />}
            color="error" // rouge pour indiquer la déconnexion
            className={className}
            variant="outlined"
            size={size}
            sx={{ ...deleteButtonStyles, ...(sx as object) }}
        />
    );
}
export function RefreshButton({ onClick, label, className, size, sx = {} }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Rafraîchir la page"
            onClick={onClick}
            icon={<RefreshIcon />}
            color="primary"
            className={className}
            variant="contained"
            size={size}
            sx={sx}
        />
    );
}

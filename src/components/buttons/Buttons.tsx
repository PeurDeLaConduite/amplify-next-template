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

import type { SxProps, Theme } from "@mui/material";
export type BackButtonProps = Pick<ButtonBaseProps, "href" | "label" | "className" | "sx">;
type ButtonProps = {
    onClick: () => void;
    href?: string;
    label?: string;
    className?: string;
    sx?: SxProps<Theme>;
    color?: string;
};

export function EditButton({ onClick, label, className, color }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Modifier"
            onClick={onClick}
            icon={<EditIcon fontSize="small" />}
            className={className}
            
            variant="outlined"
            sx={getEditButtonStyles(color)}
        />
    );
}

export function DeleteButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Supprimer"
            onClick={onClick}
            icon={<DeleteIcon fontSize="small" />}
            color="error"
            className={className}
            variant="outlined"
            sx={deleteButtonStyles}
        />
    );
}

export function BackButton({ href, onClick, label = "Retour", className, sx }: ButtonBaseProps) {
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
        />
    );
}
export function SaveButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Enregistrer"
            onClick={onClick}
            icon={<SaveIcon />}
            color="primary"
            className={className}
            variant="contained"
        />
    );
}

export function CancelButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Annuler"
            onClick={onClick}
            icon={<CancelIcon />}
            color="inherit"
            className={className}
            variant="outlined"
        />
    );
}

export function AddButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Ajouter"
            onClick={onClick}
            icon={<AddIcon />}
            color="success"
            className={className}
            variant="contained"
        />
    );
}

export function SubmitButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Envoyer"
            onClick={onClick}
            icon={<SendIcon />}
            color="primary"
            className={className}
            variant="contained"
        />
    );
}

export function ClearFieldButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Vider le champ"
            onClick={onClick}
            icon={<BackspaceIcon />}
            color="warning"
            className={className}
            variant="outlined"
        />
    );
}
export function PowerButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Déconnexion"
            onClick={onClick}
            icon={<PowerIcon />}
            color="error" // rouge pour indiquer la déconnexion
            className={className}
            variant="outlined"
            sx={{ ...(deleteButtonStyles || {}) }}
        />
    );
}
export function RefreshButton({ onClick, label, className }: ButtonProps) {
    return (
        <ButtonBase
            label={label}
            title="Rafraîchir la page"
            onClick={onClick}
            icon={<RefreshIcon />}
            color="primary"
            className={className}
            variant="contained"
        />
    );
}

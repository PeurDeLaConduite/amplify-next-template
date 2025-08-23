/* ============================================================================
 * src/components/ui/button/Buttons.tsx
 * ============================================================================
 * 🎛️ Boutons applicatifs (wrappers autour de UiButton)
 *
 * Chaque bouton implémente une intention fonctionnelle claire (CRUD / navigation /
 * interaction de formulaire). Ils encapsulent l’icône, le style par défaut et
 * parfois une couleur d’intention (`editColor`).
 *
 * ============================================================================
 * 📌 COMPONENTS
 * ============================================================================
 *
 * 🖊️ EditButton
 *   - Permet de sélectionner un objet à modifier (update ou reset).
 *   - Peut ouvrir un mode édition (ex: `editMode`).
 *
 * 🗑️ DeleteButton
 *   - Supprime complètement un objet (appel du manager `delete` côté UI).
 *
 * 💾 UpdateButton
 *   - Met à jour un objet existant (ex: `updateEntity` via manager).
 *
 * ❌ CancelButton
 *   - Sort du mode édition sans sauvegarder.
 *   - Peut aussi rappeler les données pour rétablir l’état initial du formulaire.
 *
 * ➕ AddButton
 *   - Peut ouvrir un mode édition ou créer un nouvel objet.
 *   - Dans l’app actuelle : réservé pour les cas futurs (non utilisé).
 *
 * ↩️ BackButton
 *   - Dans un `EditField`, appelle `setEditModeField(null)` → sort du mode édition.
 *   - Dans une page, redirige vers une autre URL (App Router).
 *
 * ✅ SubmitButton
 *   - Crée un nouvel objet (appel du manager `create`).
 *
 * 🧹 ClearFieldButton
 *   - Vide un champ de formulaire, puis fait un update avec une valeur vide.
 *
 * 🔄 RefreshButton
 *   - Rafraîchit les données (via `refresh`) et réinitialise le formulaire.
 *
 * 🔌 PowerButton
 *   - Déconnecte l’utilisateur (ex: `signOut` d’AWS Amplify Authenticator).
 *
 * ============================================================================
 * 🔗 Schéma d’interaction typique (UI <-> Manager <-> Backend)
 * ============================================================================
 *
 *   [Bouton UI]  --(onClick)-->  [Manager]  --(CRUD op)-->  [Backend]
 *      ^                             |
 *      |----(props: label, intent)---|
 *
 * Exemple : <DeleteButton onDelete={() => userManager.removeById(id)} />
 *
 * ============================================================================
 */

import React from "react";
import { UiButton } from "./UiButton";
import { getEditButtonStyles } from "./buttonStyles";
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

/** map taille bouton -> taille icône */
function toIconFontSize(size?: MuiButtonProps["size"]): "inherit" | "small" | "medium" | "large" {
    switch (size) {
        case "small":
            return "small";
        case "large":
            return "large";
        default:
            return "medium";
    }
}

/** clone l’icône pour forcer fontSize (si c’est bien un élément React) */
function withIconFontSize(
    icon: React.ReactNode,
    fontSize: "inherit" | "small" | "medium" | "large"
) {
    return React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<any>, { fontSize })
        : icon;
}

type VariantType = "button" | "icon";
// helpers
function mergeSx(...parts: Array<SxProps<Theme> | undefined>): SxProps<Theme> | undefined {
    const out: Array<NonNullable<SxProps<Theme>>> = [];
    for (const p of parts) {
        if (!p) continue;
        if (Array.isArray(p)) out.push(...(p as any));
        else out.push(p);
    }
    return out.length ? (out as SxProps<Theme>) : undefined;
}

/** Props communes aux wrappers */
export type ButtonWrapperProps = {
    label?: string;
    title?: string;
    className?: string;
    sx?: SxProps<Theme>;
    size?: MuiButtonProps["size"];
    variantType?: VariantType;
    ariaLabel?: string;
};

/** Petite fabrique pour éviter les répétitions */
// helpers en haut du fichier Buttons.tsx// helpers
function renderByMode(opts: {
    variantType: VariantType;
    label?: string;
    ariaLabel?: string;
    title?: string;
    icon: React.ReactNode;
    intent: "primary" | "neutral" | "success" | "danger" | "warning" | "ghost";
    variant?: MuiButtonProps["variant"];
    className?: string;
    /** style additionnel du wrapper */
    sx?: SxProps<Theme>;
    /** taille MUI Button/IconButton */
    size?: MuiButtonProps["size"];
    onClick?: () => void;
    href?: string;
    /** 👇 couleur custom pour construire un style de base (outlined colorisé) */
    editColor?: string;
}) {
    const {
        variantType,
        label,
        ariaLabel,
        title,
        icon,
        intent,
        variant,
        className,
        sx,
        size,
        onClick,
        href,
        editColor,
    } = opts;

    // 1) fallback automatique: title = label si non défini
    const safeTitle = title ?? label;

    // 2) calcule la taille de l'icône (small forcé en mode "icon")
    const iconFontSize = toIconFontSize(variantType === "icon" ? (size ?? "small") : size);
    const iconNode = withIconFontSize(icon, iconFontSize);

    // 3) style de base optionnel à partir d'une couleur custom
    const baseSx = editColor ? getEditButtonStyles(editColor) : undefined;

    // ✅ fusion correcte, sans tableau imbriqué
    const sxMerged = mergeSx(baseSx, sx);

    if (variantType === "icon") {
        return (
            <UiButton
                variantType="icon"
                href={href as any}
                icon={iconNode}
                ariaLabel={ariaLabel ?? label ?? "Action"}
                intent={intent}
                variant={variant}
                className={className}
                sx={sxMerged}
                size={size ?? "small"}
                iconButtonProps={onClick ? { onClick } : undefined}
                title={safeTitle}
            />
        );
    }

    return (
        <UiButton
            variantType="button"
            href={href as any}
            label={label ?? ""}
            icon={iconNode}
            intent={intent}
            variant={variant}
            className={className}
            sx={sxMerged}
            size={size}
            buttonProps={onClick ? { onClick } : undefined}
            title={safeTitle}
        />
    );
}

/* ---------------------------------- Edit ---------------------------------- */
export type EditButtonProps = ButtonWrapperProps & {
    onEdit: () => void;
    editColor?: string;
};

export function EditButton(props: EditButtonProps) {
    const { onEdit, label = "Modifier", editColor = "blue", ...rest } = props;

    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <EditIcon />,
        intent: "primary",
        variant: "outlined",
        editColor,
        onClick: onEdit,
    });
}

/* -------------------------------- Delete ---------------------------------- */
export type DeleteButtonProps = ButtonWrapperProps & {
    onDelete: () => void;
    editColor?: string;
};

export function DeleteButton(props: DeleteButtonProps) {
    const { onDelete, label = "Supprimer", editColor = "red", ...rest } = props;

    return renderByMode({
        ...rest,
        // défaut local si non fourni :
        variantType: rest.variantType ?? "button",
        label,
        icon: <DeleteIcon />,
        intent: "danger",
        editColor,
        variant: "outlined",
        onClick: onDelete,
    });
}
/* -------------------------------- Cancel ---------------------------------- */
export type CancelButtonProps = ButtonWrapperProps & { onCancel: () => void; editColor?: string };

export function CancelButton(props: CancelButtonProps) {
    const { onCancel, label = "Annuler", editColor = "black", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <CancelIcon />,
        intent: "ghost",
        variant: "outlined",
        onClick: onCancel,
    });
}

/* ---------------------------------- Add ----------------------------------- */
export type AddButtonProps = ButtonWrapperProps & { onAdd: () => void; editColor?: string };

export function AddButton(props: AddButtonProps) {
    const { onAdd, label = "Ajouter", editColor = "#9e9e9e", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <AddIcon />,
        intent: "success",
        onClick: onAdd,
        editColor,
    });
}

/* ------------------------------- Submit/Update ----------------------------- */
export type SubmitButtonProps = ButtonWrapperProps & { onSubmit: () => void; editColor?: string };

export function SubmitButton(props: SubmitButtonProps) {
    const { onSubmit, label = "Créer", editColor = "#9e9e9e", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <SaveIcon />,
        intent: "primary",
        onClick: onSubmit,
        editColor,
    });
}

export type UpdateButtonProps = ButtonWrapperProps & { onUpdate: () => void; editColor?: string };

export function UpdateButton(props: UpdateButtonProps) {
    const { onUpdate, label = "Enregistrer", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <SaveIcon />,
        intent: "primary",
        onClick: onUpdate,
        // editColor,
    });
}

/* ------------------------------- Clear Field ------------------------------- */
export type ClearFieldButtonProps = ButtonWrapperProps & {
    onClear: () => void;
    editColor?: string;
};

export function ClearFieldButton(props: ClearFieldButtonProps) {
    const { onClear, label = "Vider le champ", editColor = "#ed6c02", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <BackspaceIcon />,
        intent: "warning",
        variant: "outlined",
        onClick: onClear,
        editColor,
    });
}

/* --------------------------------- Power ---------------------------------- */
export type PowerButtonProps = ButtonWrapperProps & { onPowerOff: () => void; editColor?: string };

export function PowerButton(props: PowerButtonProps) {
    const { onPowerOff, label = "Déconnexion", editColor = "red", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <PowerIcon />,
        intent: "danger",
        variant: "outlined",
        onClick: onPowerOff,
        editColor,
    });
}

/* -------------------------------- Refresh --------------------------------- */
export type RefreshButtonProps = ButtonWrapperProps & { onRefresh: () => void; editColor?: string };

export function RefreshButton(props: RefreshButtonProps) {
    const { onRefresh, label = "Rafraîchir la page", editColor = "#9e9e9e", ...rest } = props;
    return renderByMode({
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <RefreshIcon />,
        intent: "primary",
        onClick: onRefresh,
        editColor,
    });
}

/* ---------------------------------- Back ---------------------------------- */
export type BackButtonProps = ButtonWrapperProps &
    ({ href: string; onBack?: never } | { onBack: () => void; href?: never }) & {
        editColor?: string;
    };

export function BackButton(props: BackButtonProps) {
    const { label = "Retour", editColor = "#1976d2", ...rest } = props; // bleu primary par défaut
    const common = {
        ...rest,
        variantType: rest.variantType ?? "button",
        label,
        icon: <ArrowBackIcon />,
        intent: "primary" as const,
        // editColor,
    };

    if ("href" in rest) {
        return renderByMode({ ...common, href: rest.href });
    }
    return renderByMode({ ...common, onClick: rest.onBack });
}
//

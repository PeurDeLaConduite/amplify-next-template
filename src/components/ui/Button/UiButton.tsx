// src/components/ui/button/UiButton.tsx
/* eslint-disable internal/no-onclick-wrapper */
import React, { forwardRef } from "react";
import NextLink from "next/link";
import {
    Button as MuiButton,
    IconButton as MuiIconButton,
    CircularProgress,
    type ButtonProps as MuiButtonProps,
    type IconButtonProps as MuiIconButtonProps,
    type SxProps,
    type Theme,
    Tooltip,
} from "@mui/material";

export type UiButtonIntent = "primary" | "neutral" | "success" | "danger" | "warning" | "ghost";

/** Propriétés communes */
type Common = {
    intent?: UiButtonIntent;
    variant?: MuiButtonProps["variant"];
    size?: MuiButtonProps["size"];
    loading?: boolean;
    tooltip?: string;
    title?: string;
    className?: string;
    sx?: SxProps<Theme>;
    disabled?: boolean;
    type?: MuiButtonProps["type"];
    /** Pass-through optionnels */
    buttonProps?: Partial<MuiButtonProps>;
    iconButtonProps?: Partial<MuiIconButtonProps>;
};

/** Dimension "visuel" (discriminant) */
type ButtonMode = Common & {
    variantType: "button";
    label: string; // requis en mode button
    icon?: React.ReactNode;
    ariaLabel?: never; // interdit (inutile avec label)
};

type IconMode = Common & {
    variantType: "icon";
    icon: React.ReactNode; // requis en mode icon
    ariaLabel: string; // requis (accessibilité)
    label?: never; // interdit (sinon c'est un button)
};

/** Dimension "navigation" vs "action" (discriminant) */
type AsLink = {
    href: string;
};

type AsButton = {
    href?: undefined;
};

export type UiButtonProps = (ButtonMode | IconMode) & (AsLink | AsButton);

function intentStyles(
    intent: UiButtonIntent | undefined
): Pick<MuiButtonProps, "color"> & { sx?: SxProps<Theme> } {
    switch (intent) {
        case "success":
            return { color: "success" };
        case "danger":
            return { color: "error" };
        case "warning":
            return { color: "warning" };
        case "ghost":
            return { color: "inherit", sx: { borderColor: "#bbb" } };
        case "neutral":
            return { color: "info" };
        case "primary":
        default:
            return { color: "primary" };
    }
}

export const UiButton = forwardRef<HTMLButtonElement, UiButtonProps>(function UiButton(props, ref) {
    const {
        variantType,
        // discriminants nav/action
        href,
        // communs
        intent = "primary",
        variant,
        size = "medium",
        loading = false,
        tooltip,
        title,
        className,
        sx,
        disabled,
        type = "button",
        buttonProps,
        iconButtonProps,
    } = props as UiButtonProps;

    const { onClick: buttonOnClick, ...restButtonProps } = buttonProps ?? {};
    const { onClick: iconButtonOnClick, ...restIconButtonProps } = iconButtonProps ?? {};

    const iv = intentStyles(intent);
    const mergedSx = (
        Array.isArray(sx) ? [{}, iv.sx, ...sx] : { ...iv.sx, ...sx }
    ) as SxProps<Theme>;
    const isDisabled = disabled || loading;

    // Rendu discriminé
    const content =
        variantType === "button" ? (
            <MuiButton
                ref={ref}
                component={href ? NextLink : undefined}
                href={href}
                onClick={buttonOnClick}
                size={size}
                color={iv.color}
                variant={variant ?? (intent === "ghost" ? "outlined" : "contained")}
                className={className}
                sx={mergedSx}
                disabled={isDisabled}
                startIcon={props.icon}
                type={type}
                title={title}
                {...restButtonProps}
            >
                {loading ? <CircularProgress size={18} /> : props.label}
            </MuiButton>
        ) : (
            <MuiIconButton
                ref={ref as any}
                component={href ? NextLink : undefined}
                {...((href ? { href } : {}) as any)}
                onClick={iconButtonOnClick}
                size={size}
                color={iv.color as any}
                className={className}
                sx={mergedSx}
                disabled={isDisabled}
                title={title}
                aria-label={props.ariaLabel}
                {...restIconButtonProps}
            >
                {loading ? <CircularProgress size={18} /> : props.icon}
            </MuiIconButton>
        );

    return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content;
});

export default UiButton;

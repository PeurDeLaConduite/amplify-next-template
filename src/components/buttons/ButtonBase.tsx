// src/components/buttons/ButtonBase.tsx
import React from "react";
import NextLink from "next/link";
import { Button, IconButton, ButtonProps as MuiButtonProps, SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";

export type ButtonBaseProps = {
    label?: string;
    title?: string;
    onClick?: () => void;
    href?: string;
    icon?: ReactNode;
    color?: MuiButtonProps["color"];
    variant?: MuiButtonProps["variant"];
    disabled?: boolean;
    className?: string;
    sx?: SxProps<Theme>;
    size?: MuiButtonProps["size"];
};

export default function ButtonBase({
    label,
    size = "medium",
    title,
    onClick,
    href,
    icon,
    color = "primary",
    variant = "contained",
    disabled = false,
    className = "",
    sx = {},
}: ButtonBaseProps) {
    // Propriétés communes
    const common = { size, color, variant, disabled, className, sx, onClick };

    // Cas “button avec label”
    if (label) {
        // Si on a un href, on rend un MUI Button en tant que NextLink
        return href ? (
            <Button component={NextLink} href={href} {...common} startIcon={icon}>
                {label}
            </Button>
        ) : (
            <Button {...common} startIcon={icon}>
                {label}
            </Button>
        );
    }

    // Cas “icon only”
    return href ? (
        <IconButton component={NextLink} href={href} title={title} {...common}>
            {icon}
        </IconButton>
    ) : (
        <IconButton title={title} {...common}>
            {icon}
        </IconButton>
    );
}

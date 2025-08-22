// src/components/ui/button/buttonStyles.ts
import type { SxProps, Theme } from "@mui/material";

export const commonButtonStyles: SxProps<Theme> = {
    minWidth: 32,
    minHeight: 32,
    padding: 0.5,
    borderRadius: 1,
    textTransform: "none",
};

export const getEditButtonStyles = (color: string = "blue"): SxProps<Theme> => ({
    ...commonButtonStyles,
    border: `1px solid ${color}`,
    color,
    "&:hover": {
        bgcolor: color,
        color: "white",
        border: `1px solid ${color}`,
        "& svg": { color: "white" },
    },
});

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

export const editButtonStyles: SxProps<Theme> = {
    ...commonButtonStyles,
    border: "1px solid #1976d2",
    color: "#1976d2",
    "&:hover": {
        bgcolor: "#1976d2",
        color: "#ffffff",
        border: "1px solid #1976d2",
        "& svg": { color: "#ffffff" },
    },
};

export const deleteButtonStyles: SxProps<Theme> = {
    ...commonButtonStyles,
    border: "1px solid red",
    color: "red",
    "&:hover": {
        bgcolor: "red",
        color: "white",
        border: "1px solid red",
        "& svg": { color: "white" },
    },
};
export function getButtonVariant(type: "edit" | "delete" | "save"): SxProps<Theme> {
    switch (type) {
        case "edit":
            return editButtonStyles;
        case "delete":
            return deleteButtonStyles;
        default:
            return {};
    }
}

// export function getEditButtonStyles(color?: string): SxProps<Theme> {
//     return {
//         filter: "brightness(1.1)",
//         "&:hover": {
//             filter: "brightness(1.25)",
//         },
//         ...(color ? { color } : {}),
//     };
// }

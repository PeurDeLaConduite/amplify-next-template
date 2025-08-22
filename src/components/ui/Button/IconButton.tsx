import NextLink from "next/link";
import {
    IconButton as MuiIconButton,
    type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";

export type IconButtonProps = MuiIconButtonProps & {
    href?: string;
    ariaLabel: string;
};

export default function IconButton({ href, ariaLabel, ...props }: IconButtonProps) {
    return href ? (
        <MuiIconButton component={NextLink} href={href} aria-label={ariaLabel} {...props} />
    ) : (
        <MuiIconButton aria-label={ariaLabel} {...props} />
    );
}

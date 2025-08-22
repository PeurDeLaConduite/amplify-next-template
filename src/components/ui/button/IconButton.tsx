import NextLink from "next/link";
import {
    IconButton as MuiIconButton,
    type IconButtonProps as MuiIconButtonProps,
} from "@mui/material";

export type IconButtonProps = MuiIconButtonProps & {
    href?: string;
};

export default function IconButton({ href, ...props }: IconButtonProps) {
    return href ? (
        <MuiIconButton component={NextLink} href={href} {...props} />
    ) : (
        <MuiIconButton {...props} />
    );
}

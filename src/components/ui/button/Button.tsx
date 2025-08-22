import NextLink from "next/link";
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from "@mui/material";

export type ButtonProps = MuiButtonProps & {
    href?: string;
};

export default function Button({ href, ...props }: ButtonProps) {
    return href ? (
        <MuiButton component={NextLink} href={href} {...props} />
    ) : (
        <MuiButton {...props} />
    );
}

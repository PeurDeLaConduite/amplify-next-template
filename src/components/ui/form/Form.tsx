import type { FormHTMLAttributes } from "react";

export type FormProps = FormHTMLAttributes<HTMLFormElement>;

export default function Form({ children, ...props }: FormProps) {
    return <form {...props}>{children}</form>;
}

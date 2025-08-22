import type { LabelHTMLAttributes } from "react";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export default function Label({ children, className = "", ...props }: LabelProps) {
    return (
        <label className={className} {...props}>
            {children}
        </label>
    );
}

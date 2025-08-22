import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { className = "", ...props },
    ref
) {
    return <input ref={ref} className={className} {...props} />;
});

export default Input;

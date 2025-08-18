import React from "react";

interface Props {
    children: React.ReactNode;
    loading?: boolean;
    className?: string;
}

export default function SectionHeader({ children, loading = false, className = "" }: Props) {
    return (
        <h2 className={`text-xl font-semibold mb-4 border-b ${className}`}>
            {children}
            {loading && <span className=" ml-2 animate-pulse">Actualisation…</span>}
        </h2>
    );
}

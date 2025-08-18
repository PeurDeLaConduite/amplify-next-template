import React from "react";
import ListLoader from "@components/Blog/manage/ListLoader";

interface Props {
    children: React.ReactNode;
    loading?: boolean;
    className?: string;
}

export default function SectionHeader({ children, loading = false, className = "" }: Props) {
    return (
        <h2 className={`text-xl font-semibold mb-4 border-b ${className}`}>
            {children}
            {loading && <ListLoader />}
        </h2>
    );
}

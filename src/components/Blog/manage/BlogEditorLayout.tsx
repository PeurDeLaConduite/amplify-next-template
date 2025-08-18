import React from "react";

interface BlogEditorLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function BlogEditorLayout({ title, children }: BlogEditorLayoutProps) {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            {children}
        </div>
    );
}

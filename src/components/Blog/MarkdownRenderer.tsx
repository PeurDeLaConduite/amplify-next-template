// src/components/Blog/MarkdownRenderer.tsx
"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
    children: string; // contenu Markdown passé en tant que children
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
    return (
        <div className="prose mx-auto markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
    );
}

+12 - 1;
// src/components/Blog/MarkdownRenderer.tsx
("use client");
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

interface MarkdownRendererProps {
    children: string; // contenu Markdown passé en tant que children
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
    const sanitizeConfig = {
        ...defaultSchema,
        // Ajoutez ici les éléments HTML supplémentaires à autoriser
        tagNames: [...(defaultSchema.tagNames || [])],
    };
    return (
        <div className="prose mx-auto markdown-container">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeSanitize, sanitizeConfig]]}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}

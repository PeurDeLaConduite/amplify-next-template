"use client";

import edjsHTML from "editorjs-html";
import type { OutputData } from "@editorjs/editorjs";

const parser = edjsHTML();

interface ArticleRendererProps {
    data: OutputData;
}

export default function ArticleRenderer({ data }: ArticleRendererProps) {
    const html = parser.parse(data).join("");
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

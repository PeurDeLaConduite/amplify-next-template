// src/components/Blog/SectionCard.tsx
import React, { memo, useMemo } from "react";
import { Section, Post, Author } from "@src/types/blog";
import BlogList from "./BlogList";
import Link from "next/link";

interface SectionCardProps {
    section: Section;
    posts: Post[];
    authors: Author[];
}

function BlogSectionCard({ section, posts, authors }: SectionCardProps) {
    const list = useMemo(() => <BlogList posts={posts} authors={authors} />, [posts, authors]);

    return (
        <section
            className="mb-12 overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
            aria-labelledby={`Section regroupant des ${section.description}`}
        >
            {/* Bandeau de titre */}
            <div className="bg-blue-50 px-6 py-4">
                <h2 className="text-2xl font-semibold text-blue-700">{section.title}</h2>
                <p className="text-blue-600 mt-1">{section.description}</p>
                <Link
                    href={`/blog/sections/${section.slug}`}
                    className="inline-block text-sm mt-4 text-blue-500 underline"
                >
                    Voir tous les articles →
                </Link>
            </div>
            {/* Contenu de la section */}
            <div className="bg-white px-6 py-8">{list}</div>
        </section>
    );
}

export default memo(BlogSectionCard);

// src/components/Blog/Blog.tsx
import React, { useMemo } from "react";
import { Section, Post, Author } from "@src/types/blog";
import BlogSectionCard from "./BlogSectionCard";
import PostContent from "./PostContent";

type BlogProps = {
    data: {
        sections: Section[];
        posts: Post[];
        authors: Author[];
    };
    singlePost?: Post;
    noWrapper?: boolean;
};

const Blog: React.FC<BlogProps> = ({ data, singlePost, noWrapper }) => {
    const { sections = [], posts = [], authors = [] } = data || {};

    const publishedPosts = useMemo(() => posts.filter((p) => p.status === "published"), [posts]);

    const sectionCards = useMemo(
        () =>
            sections
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                    const postsInSection = publishedPosts.filter((p) =>
                        p.sectionJsonIds.includes(section.sectionJsonId)
                    );
                    if (!postsInSection.length) return null;
                    return (
                        <BlogSectionCard
                            key={section.sectionJsonId}
                            section={section}
                            posts={postsInSection}
                            authors={authors}
                        />
                    );
                }),
        [sections, publishedPosts, authors]
    );

    if (singlePost) {
        const author = authors.find((a) => a.authorJsonId === singlePost.authorJsonId);
        if (!author) return <p>Auteur introuvable</p>;
        return <PostContent post={singlePost} author={author} />;
    }

    if (posts.length === 0) {
        return <p>Aucun article publié pour le moment.</p>;
    }

    const content = (
        <>
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            {sectionCards}
        </>
    );

    if (noWrapper) {
        return <>{content}</>;
    }

    return <div className="max-w-5xl mx-auto px-4 py-8">{content}</div>;
};

export default Blog;

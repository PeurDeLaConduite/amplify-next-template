// src/components/Blog/BlogList.tsx
import { memo, useMemo } from "react";
import BlogCard from "./BlogCard";
import type { Post, Author } from "@myTypes/blog";

type Props = {
    posts: Post[];
    authors: Author[];
};

function BlogList({ posts, authors }: Props) {
    const cards = useMemo(
        () =>
            posts.map((post) => {
                const author = authors.find((a) => a.authorJsonId === post.authorJsonId)!;
                return <BlogCard key={post.postJsonId} post={post} author={author} />;
            }),
        [posts, authors]
    );

    return <div className="grid gap-6 md:grid-cols-2">{cards}</div>;
}

export default memo(BlogList);

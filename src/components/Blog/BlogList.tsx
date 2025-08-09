// src/components/Blog/BlogList.tsx
import BlogCard from "./BlogCard";
import type { Post, Author } from "@myTypes/blog";

type Props = {
    posts: Post[];
    authors: Author[];
};

export default function BlogList({ posts, authors }: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => {
                const author = authors.find((a) => a.authorJsonId === post.authorJsonId)!;
                return <BlogCard key={post.postJsonId} post={post} author={author} />;
            })}
        </div>
    );
}

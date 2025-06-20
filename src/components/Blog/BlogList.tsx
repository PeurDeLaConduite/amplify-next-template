// src/components/Blog/BlogList.tsx
import BlogCard from "./BlogCard";
import type { Post, Author } from "@/src/types/blog";

type Props = {
    posts: Post[];
    authors: Author[];
};

export default function BlogList({ posts, authors }: Props) {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => {
                const author = authors.find((a) => a.id === post.authorId)!;
                return <BlogCard key={post.id} post={post} author={author} />;
            })}
        </div>
    );
}

// src/components/Blog/PostContent.tsx
import React from "react";
import VideoEmbed from "./VideoEmbed";
import { Post, Author } from "@src/types/blog";
import MarkdownRenderer from "./MarkdownRenderer";

interface PostContentProps {
    post: Post & { content: string }; // Markdown content
    author: Author;
}

const PostContent: React.FC<PostContentProps> = ({ post, author }) => (
    <article className="mx-auto max-w-3xl py-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
            Par {author.authorName} ·{" "}
            {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
        </div>

        {post.videoUrl && <VideoEmbed url={post.videoUrl} title={`Vidéo de ${post.title}`} />}

        {/* Rendu du Markdown via ReactMarkdown */}
        <MarkdownRenderer>{post.content}</MarkdownRenderer>
    </article>
);

export default PostContent;

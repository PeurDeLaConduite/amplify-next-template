import type { Post, PostForm } from "@/src/types";
import { initialSeoForm, toSeoForm } from "./seoForm";

export const initialPostForm: PostForm = {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    authorId: "",
    order: 1,
    videoUrl: "",
    type: "",
    seo: { ...initialSeoForm },
    tagIds: [],
    sectionIds: [],
};

export function toPostForm(post: Post, tagIds: string[], sectionIds: string[]): PostForm {
    return {
        slug: post.slug ?? "",
        title: post.title ?? "",
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        status: (post.status as "draft" | "published") ?? "draft",
        authorId: post.authorId ?? "",
        order: post.order ?? 1,
        videoUrl: post.videoUrl ?? "",
        type: post.type ?? "",
        seo: toSeoForm(post.seo),
        tagIds,
        sectionIds,
    };
}

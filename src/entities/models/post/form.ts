import { type PostType, type PostFormType, toSeoForm } from "@src/entities";
import { createModelForm } from "@src/entities/core";
import { initialSeoForm } from "@/src/entities/customTypes/seo/form";

export const { initialForm: initialPostForm, toForm: toPostForm } = createModelForm<
    PostType,
    PostFormType,
    [string[], string[]]
>(
    {
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
    },
    (post, tagIds: string[] = [], sectionIds: string[] = []) => ({
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
    })
);

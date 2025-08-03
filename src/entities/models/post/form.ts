import { type Post, type SeoOmit, toSeoForm } from "@src/entities";
import { ModelForm, createModelForm } from "@utils/createModelForm";
import { initialSeoForm } from "@/src/entities/customTypes/seo/form";

type PostCustomTypes = { seo: SeoOmit };
export type PostForm = ModelForm<
    "Post",
    "comments" | "sections" | "tags" | "author",
    "tag" | "section",
    PostCustomTypes,
    "seo"
>;
export const { initialForm: initialPostForm, toForm: toPostForm } = createModelForm<
    Post,
    PostForm,
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

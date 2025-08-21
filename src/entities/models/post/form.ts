import { z, type ZodType } from "zod";
import {
    type PostType,
    type PostFormType,
    type PostTypeUpdateInput,
    type PostTypeOmit,
} from "@entities/models/post/types";
import { toSeoForm, initialSeoForm, seoSchema } from "@entities/customTypes/seo";
import type { SeoType } from "@entities/customTypes/seo";
import { createModelForm } from "@entities/core";

type PostTypeCreateInput = Omit<PostTypeOmit, "comments" | "author" | "sections" | "tags">;

export const {
    zodSchema: postSchema,
    initialForm: initialPostForm,
    toForm: toPostForm,
    toCreate: toPostCreate,
    toUpdate: toPostUpdate,
} = createModelForm<
    PostType,
    PostFormType,
    PostTypeCreateInput,
    PostTypeUpdateInput,
    [string[], string[]]
>({
    zodSchema: z.object({
        id: z.string().optional(),
        slug: z.string(),
        title: z.string(),
        excerpt: z.string(),
        content: z.string(),
        status: z.string(),
        authorId: z.string(),
        order: z.number(),
        videoUrl: z.string(),
        type: z.string(),
        seo: seoSchema,
        tagIds: z.array(z.string()),
        sectionIds: z.array(z.string()),
    }) as ZodType<PostFormType>,
    initialForm: {
        id: "",
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
    toForm: (post, tagIds: string[] = [], sectionIds: string[] = []) => ({
        id: post.id ?? "",
        slug: post.slug ?? "",
        title: post.title ?? "",
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        status: (post.status as "draft" | "published") ?? "draft",
        authorId: post.authorId ?? "",
        order: post.order ?? 1,
        videoUrl: post.videoUrl ?? "",
        type: post.type ?? "",
        seo: toSeoForm((post.seo ?? {}) as SeoType),
        tagIds,
        sectionIds,
    }),
    toCreate: (form: PostFormType): PostTypeCreateInput => {
        const { id, tagIds, sectionIds, ...values } = form;
        void id;
        void tagIds;
        void sectionIds;
        return values as PostTypeCreateInput;
    },
    toUpdate: (form: PostFormType): PostTypeUpdateInput => {
        const { tagIds, sectionIds, ...values } = form;
        void tagIds;
        void sectionIds;
        return values;
    },
});

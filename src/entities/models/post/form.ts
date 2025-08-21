import { z, type ZodType } from "zod";
import {
    type PostType,
    type PostFormType,
    type PostTypeUpdateInput,
} from "@entities/models/post/types";
import { toSeoForm, initialSeoForm, seoSchema } from "@entities/customTypes/seo";
import type { SeoType } from "@entities/customTypes/seo";
import { createModelForm } from "@entities/core";

export const {
    zodSchema: postSchema,
    initialForm: initialPostForm,
    toForm: toPostForm,
    toCreate: toPostCreate,
    toUpdate: toPostUpdate,
} = createModelForm<PostType, PostFormType, PostTypeUpdateInput, PostTypeUpdateInput>({
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
    toForm: (post): PostFormType => ({
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
        tagIds: (post.tags ?? []).map((t) => t.tagId),
        sectionIds: (post.sections ?? []).map((s) => s.sectionId),
    }),
    toCreate: (form: PostFormType): PostTypeUpdateInput => {
        const { id: _id, tagIds, sectionIds, ...values } = form;
        void tagIds;
        void sectionIds;
        void _id;
        return values;
    },
    toUpdate: (form: PostFormType): PostTypeUpdateInput => {
        const { id: _id, tagIds, sectionIds, ...values } = form;
        void tagIds;
        void sectionIds;
        void _id;
        return values;
    },
});

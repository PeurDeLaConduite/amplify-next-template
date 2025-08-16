// AUTO-GENERATED – DO NOT EDIT
import type { PostType, PostFormType, PostTypeOmit } from "./types";
import { createModelForm } from "@entities/core";

import { initialSeoForm, toSeoForm } from "@entities/customTypes/seo/form";

export const initialPostForm: PostFormType = {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    videoUrl: "",
    authorId: "",
    order: 0,
    type: "",
    status: "",
    seo: { ...initialSeoForm },
    tagIds: [] as string[],
    sectionIds: [] as string[],
};

function toPostForm(
    model: PostType,
    tagIds: string[] = [],
    sectionIds: string[] = []
): PostFormType {
    return {
        slug: model.slug ?? "",
        title: model.title ?? "",
        excerpt: model.excerpt ?? "",
        content: model.content ?? "",
        videoUrl: model.videoUrl ?? "",
        authorId: model.authorId ?? "",
        order: model.order ?? 0,
        type: model.type ?? "",
        status: model.status ?? "",
        seo: toSeoForm(model.seo),
        tagIds,
        sectionIds,
    };
}

function toPostInput(form: PostFormType): PostTypeOmit {
    const { tagIds, sectionIds, ...rest } = form;
    void tagIds;
    void sectionIds;
    return rest as PostTypeOmit;
}

export const postForm = createModelForm<PostType, PostFormType, [string[], string[]], PostTypeOmit>(
    initialPostForm,
    (model, tagIds: string[] = [], sectionIds: string[] = []) =>
        toPostForm(model, tagIds, sectionIds),
    toPostInput
);

export { toPostForm, toPostInput };

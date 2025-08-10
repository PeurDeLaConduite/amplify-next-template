import { initialPostForm, toPostForm } from "./form";
import type { PostFormType, PostTypeOmit, PostTypeUpdateInput } from "./types";

export const postConfig = {
    auth: "admin",
    identifier: "id",
    fields: [
        "slug",
        "title",
        "excerpt",
        "content",
        "videoUrl",
        "authorId",
        "order",
        "type",
        "status",
        "seo",
    ],
    relations: ["author", "tags", "sections", "comments"],
    toForm: toPostForm,
    toCreate: (form: PostFormType): PostTypeOmit => {
        const { tagIds, sectionIds, ...values } = form;
        void tagIds;
        void sectionIds;
        return values;
    },
    toUpdate: (form: PostFormType): PostTypeUpdateInput => {
        const { tagIds, sectionIds, ...values } = form;
        void tagIds;
        void sectionIds;
        return values;
    },
    initialForm: initialPostForm,
};

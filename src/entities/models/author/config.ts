import { initialAuthorForm, toAuthorForm } from "./form";
import type { AuthorFormType, AuthorTypeUpdateInput } from "./types";

export const authorConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["authorName", "bio", "email", "avatar", "order"],
    relations: ["posts"],
    toForm: toAuthorForm,
    toCreate: (form: AuthorFormType): AuthorTypeUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    toUpdate: (form: AuthorFormType): AuthorTypeUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    initialForm: initialAuthorForm,
};

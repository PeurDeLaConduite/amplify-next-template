import { z, type ZodType } from "zod";
import type {
    AuthorType,
    AuthorFormType,
    AuthorTypeCreateInput,
    AuthorTypeUpdateInput,
} from "./types";
import { createModelForm } from "@entities/core";

export const {
    zodSchema: authorSchema,
    initialForm: initialAuthorForm,
    toForm: toAuthorForm,
    toCreate: toAuthorCreate,
    toUpdate: toAuthorUpdate,
} = createModelForm<
    AuthorType,
    AuthorFormType,
    AuthorTypeCreateInput,
    AuthorTypeUpdateInput,
    [string[]]
>({
    zodSchema: z.object({
        id: z.string().optional(),
        authorName: z.string(),
        avatar: z.string(),
        bio: z.string(),
        email: z.string(),
        postIds: z.array(z.string()),
    }) as ZodType<AuthorFormType>,
    initialForm: {
        id: "",
        authorName: "",
        avatar: "",
        bio: "",
        email: "",
        postIds: [],
    },
    toForm: (author, postIds: string[] = []) => ({
        id: author.id ?? "",
        authorName: author.authorName ?? "",
        avatar: author.avatar ?? "",
        bio: author.bio ?? "",
        email: author.email ?? "",
        postIds,
    }),
    toCreate: (form: AuthorFormType): AuthorTypeCreateInput => {
        const { postIds, id: _id, ...values } = form;
        void postIds;
        void _id;
        return values;
    },
    toUpdate: (form: AuthorFormType): AuthorTypeUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
});

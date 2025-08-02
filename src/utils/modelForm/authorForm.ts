import type { Author, AuthorForm } from "@src/entities";
import { createModelForm } from "../createModelForm";

export const { initialForm: initialAuthorForm, toForm: toAuthorForm } = createModelForm<
    Author,
    AuthorForm,
    [string[]]
>(
    {
        name: "",
        avatar: "",
        bio: "",
        email: "",
        postIds: [],
    },
    (author, postIds: string[] = []) => ({
        name: author.name ?? "",
        avatar: author.avatar ?? "",
        bio: author.bio ?? "",
        email: author.email ?? "",
        postIds,
    })
);

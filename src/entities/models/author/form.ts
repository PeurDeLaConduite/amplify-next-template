import type { AuthorType, AuthorFormType } from "./types";
import { createModelForm } from "@/src/utils/createModelForm";

export const { initialForm: initialAuthorForm, toForm: toAuthorForm } = createModelForm<
    AuthorType,
    AuthorFormType,
    [string[]]
>(
    {
        authorName: "",
        avatar: "",
        bio: "",
        email: "",
        postIds: [],
    },
    (author, postIds: string[] = []) => ({
        authorName: author.authorName ?? "",
        avatar: author.avatar ?? "",
        bio: author.bio ?? "",
        email: author.email ?? "",
        postIds,
    })
);

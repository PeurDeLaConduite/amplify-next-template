import type { AuthorType, AuthorFormType } from "./types";
import { createModelForm } from "@/src/utils/createModelForm";

export const { initialForm: initialAuthorForm, toForm: toAuthorForm } = createModelForm<
    AuthorType,
    AuthorFormType,
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

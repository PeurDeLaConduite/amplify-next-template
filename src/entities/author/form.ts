import type { Author } from "./author";
import { createModelForm, type ModelForm } from "@/src/utils/createModelForm";

export type AuthorForm = ModelForm<"Author", "posts", "post">;

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

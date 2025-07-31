import type { Author, AuthorForm } from "@/src/types";

export const initialAuthorForm: AuthorForm = {
    name: "",
    avatar: "",
    bio: "",
    email: "",
    postIds: [],
};

export function toAuthorForm(author: Author, postIds: string[]): AuthorForm {
    return {
        name: author.name ?? "",
        avatar: author.avatar ?? "",
        bio: author.bio ?? "",
        email: author.email ?? "",
        postIds,
    };
}

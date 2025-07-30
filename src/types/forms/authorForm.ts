import type { AuthorOmit } from "../models/author";

export type AuthorForm = Omit<AuthorOmit, "posts"> & {
    postIds: string[];
};
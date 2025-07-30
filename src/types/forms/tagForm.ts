import type { TagOmit } from "../models/tag";

export type TagForm = Omit<TagOmit, "posts"> & {
    postIds: string[];
};

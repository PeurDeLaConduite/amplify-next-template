import type { PostOmit } from "../models/post";
import type { SeoOmit } from "../models/seo";

export type PostForm = Omit<PostOmit, "comments" | "sections" | "tags" | "seo" | "author"> & {
    seo: SeoOmit;
    tagIds: string[];
    sectionIds: string[];
};

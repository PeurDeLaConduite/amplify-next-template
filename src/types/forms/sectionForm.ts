import type { SectionOmit } from "../models/section";
import type { SeoOmit } from "../models/seo";

export type SectionForm = Omit<SectionOmit, "posts" | "seo"> & {
    seo: SeoOmit;
    postIds: string[];
};

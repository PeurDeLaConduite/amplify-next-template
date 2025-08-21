import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";
import { type SeoTypeOmit } from "@entities/customTypes/seo/types";

export type PostType = BaseModel<"Post">;
export type PostTypeOmit = CreateOmit<"Post">;
export type PostTypeUpdateInput = Omit<UpdateInput<"Post">, "authorId"> & {
    authorId?: string | null;
};

type PostCustomTypes = { seo: SeoTypeOmit };
export type PostFormType = ModelForm<
    "Post",
    "comments" | "sections" | "tags" | "author",
    "tag" | "section",
    PostCustomTypes,
    "seo"
>;

import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";
import { type SeoTypeOmit } from "@entities/customTypes/seo/types";

export type PostType = BaseModel<"Post">;
export type PostTypeOmit = CreateOmit<"Post">;
export type PostTypeCreateInput = UpdateInput<"Post">;
export type PostTypeUpdateInput = { id: string } & Partial<PostTypeCreateInput>;
type PostCustomType = { seo: SeoTypeOmit };
export type PostFormType = ModelForm<
    "Post",
    "comments" | "sections" | "tags" | "author",
    "tag" | "section",
    PostCustomType,
    "seo"
>;

import type { BaseModel, CreateOmit, ModelForm } from "@entities/core/types";
import { type SeoTypeOmit } from "@entities/customTypes/seo/types";

export type PostType = BaseModel<"Post">;
export type PostTypeCreateInput = CreateOmit<"Post">;
export type PostTypeUpdateInput = { id: string } & Partial<PostTypeCreateInput>;

type PostCustomTypes = { seo: SeoTypeOmit };
export type PostFormType = ModelForm<
    "Post",
    "comments" | "sections" | "tags" | "author",
    "tag" | "section",
    PostCustomTypes,
    "seo"
>;

import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type TagType = BaseModel<"Tag">;
export type TagTypeOmit = CreateOmit<"Tag">;
export type TagTypeCreateInput = Omit<TagTypeOmit, "id" | "posts">;
export type TagTypeUpdateInput = UpdateInput<"Tag">;
export type TagFormType = ModelForm<"Tag", "posts", "post">;

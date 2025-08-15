import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core/types";

export type TagType = BaseModel<"Tag">;
export type TagTypeOmit = CreateOmit<"Tag">;
export type TagTypeCreateInput = UpdateInput<"Tag">;
export type TagTypeUpdateInput = { id: string } & Partial<TagTypeCreateInput>;
export type TagFormType = ModelForm<"Tag", "posts", "post">;

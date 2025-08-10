import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";

export type TagType = BaseModel<"Tag">;
export type TagTypeOmit = CreateOmit<"Tag">;
export type TagTypeUpdateInput = UpdateInput<"Tag">;
export type TagFormType = ModelForm<"Tag", "posts", "post">;
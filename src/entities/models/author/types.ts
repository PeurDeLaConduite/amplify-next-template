import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type AuthorType = BaseModel<"Author">;
export type AuthorTypeOmit = CreateOmit<"Author">;
export type AuthorTypeUpdateInput = UpdateInput<"Author">;
export type AuthorFormType = ModelForm<"Author", "posts", "post">;

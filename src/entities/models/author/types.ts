// src/entities/models/author/types.tsx

import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type AuthorType = BaseModel<"Author">;
export type AuthorTypeOmit = CreateOmit<"Author">;

export type AuthorTypeCreateInput = UpdateInput<"Author">;
export type AuthorTypeUpdateInput = { id: string } & Partial<AuthorTypeCreateInput>;

export type AuthorFormType = ModelForm<"Author", "posts", "post">;

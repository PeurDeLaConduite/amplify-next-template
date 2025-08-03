import type { BaseModel, CreateOmit, UpdateInput } from "@myTypes/amplifyBaseTypes";

export type Post = BaseModel<"Post">;
export type PostOmit = CreateOmit<"Post">;
export type PostUpdateInput = UpdateInput<"Post">;

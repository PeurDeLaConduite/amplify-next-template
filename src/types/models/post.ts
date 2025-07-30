import type { BaseModel, CreateOmit, UpdateInput } from "../amplifyBaseTypes";

export type Post = BaseModel<"Post">;
export type PostOmit = CreateOmit<"Post">;
export type PostUpdateInput = UpdateInput<"Post">;

import type { BaseModel, CreateOmit, UpdateInput } from "../amplifyBaseTypes";

export type Comment = BaseModel<"Comment">;
export type CommentOmit = CreateOmit<"Comment">;
export type CommentUpdateInput = UpdateInput<"Comment">;

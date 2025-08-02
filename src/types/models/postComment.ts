import type { BaseModel, CreateOmit, UpdateInput } from "@myTypes/amplifyBaseTypes";

export type PostComment = BaseModel<"PostComment">;
export type PostCommentOmit = CreateOmit<"PostComment">;
export type PostCommentUpdateInput = UpdateInput<"PostComment">;

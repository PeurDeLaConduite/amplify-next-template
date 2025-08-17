import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type CommentModel = BaseModel<"Comment">;
export type CommentCreateInput = CreateOmit<"Comment">;
export type CommentUpdateInput = UpdateInput<"Comment">;
export type CommentFormType = ModelForm<"Comment">;

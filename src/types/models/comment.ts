import type { BaseModel, UpdateInput, ModelForm } from "@entities/core";

export type CommentModel = BaseModel<"Comment">;
export type CommentCreateInput = {
    content: string;
    todoId?: string;
    postId?: string;
    userNameId: string;
};
export type CommentUpdateInput = UpdateInput<"Comment">;
export type CommentFormType = ModelForm<"Comment">;

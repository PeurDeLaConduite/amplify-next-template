import type { BaseModel, UpdateInput, ModelForm } from "@entities/core";

export type CommentModel = BaseModel<"Comment">;
export type CommentCreateInput = {
    content: string;
    todoId?: string;
    postId?: string;
    userNameId: string;
};
export type CommentUpdateInput = Omit<UpdateInput<"Comment">, "userNameId"> & {
    userNameId?: string | null;
};
export type CommentFormType = ModelForm<"Comment">;

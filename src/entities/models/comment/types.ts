import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type CommentType = BaseModel<"Comment">;
export type CommentTypeOmit = CreateOmit<"Comment">;
export type CommentTypeCreateInput = {
    content: string;
    todoId?: string;
    postId?: string;
    userNameId: string;
};
export type CommentTypeUpdateInput = Omit<UpdateInput<"Comment">, "userNameId"> & {
    userNameId?: string | null;
};
export type CommentFormType = ModelForm<"Comment", "todo" | "post" | "userName">;

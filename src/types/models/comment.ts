import type { BaseModel, UpdateInput, ModelForm } from "@entities/core";
import type { LazyLoader } from "@aws-amplify/data-schema-types";
import type { TodoModel } from "@src/types/models/todo";
import type { PostType } from "@entities/models/post/types";
import type { UserNameType } from "@entities/models/userName/types";

export type CommentModel = BaseModel<"Comment">;
export type CommentCreateInput = {
    content: string;
    todoId?: string | null;
    postId?: string | null;
    userNameId?: string | null;
};
export type CommentUpdateInput = Omit<
    UpdateInput<"Comment">,
    "todoId" | "postId" | "userNameId"
> & {
    todoId?: string | null;
    postId?: string | null;
    userNameId?: string | null;
};
export type CommentFormType = Omit<ModelForm<"Comment">, "todo" | "post" | "userName"> & {
    todo: LazyLoader<TodoModel | null, false> | null;
    post: LazyLoader<PostType | null, false> | null;
    userName: LazyLoader<UserNameType | null, false> | null;
};

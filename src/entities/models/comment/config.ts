import {
    commentSchema,
    initialCommentForm,
    toCommentForm,
    toCommentCreate,
    toCommentUpdate,
} from "./form";

export const commentConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["content", "todoId", "postId", "userNameId"],
    relations: ["todo", "post", "userName"],
    zodSchema: commentSchema,
    toForm: toCommentForm,
    toCreate: toCommentCreate,
    toUpdate: toCommentUpdate,
    initialForm: initialCommentForm,
};

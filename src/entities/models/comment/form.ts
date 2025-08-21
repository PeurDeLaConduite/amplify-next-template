import { z, type ZodType } from "zod";
import { createModelForm } from "@entities/core";
import type {
    CommentType,
    CommentFormType,
    CommentTypeCreateInput,
    CommentTypeUpdateInput,
} from "./types";

export const {
    zodSchema: commentSchema,
    initialForm: initialCommentForm,
    toForm: toCommentForm,
    toCreate: toCommentCreate,
    toUpdate: toCommentUpdate,
} = createModelForm<CommentType, CommentFormType, CommentTypeCreateInput, CommentTypeUpdateInput>({
    zodSchema: z.object({
        id: z.string().optional(),
        content: z.string(),
        todoId: z.string().optional(),
        postId: z.string().optional(),
        userNameId: z.string(),
    }) as ZodType<CommentFormType>,
    initialForm: {
        id: "",
        content: "",
        todoId: "",
        postId: "",
        userNameId: "",
    },
    toForm: (comment) => ({
        id: comment.id ?? "",
        content: comment.content ?? "",
        todoId: comment.todoId ?? "",
        postId: comment.postId ?? "",
        userNameId: comment.userNameId ?? "",
    }),
    toCreate: (form: CommentFormType): CommentTypeCreateInput => {
        const { id, todoId, postId, ...rest } = form;
        void id;
        return {
            ...rest,
            todoId: todoId || undefined,
            postId: postId || undefined,
        };
    },
    toUpdate: (form: CommentFormType): CommentTypeUpdateInput => {
        const { id, todoId, postId, ...rest } = form;
        void id;
        return {
            ...rest,
            todoId: todoId || undefined,
            postId: postId || undefined,
        };
    },
});

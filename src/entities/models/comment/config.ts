// AUTO-GENERATED – DO NOT EDIT
import type { CommentType } from "./types";
import { z } from "zod";

export type CommentEditableKeys = "content" | "todoId" | "postId" | "userNameId";

export const commentConfig = {
    model: "Comment" as const,

    fields: ["content", "todoId", "postId", "userNameId"] as CommentEditableKeys[],

    labels(field: CommentEditableKeys): string {
        switch (field) {
            case "content":
                return "Content";
            case "todoId":
                return "TodoId";
            case "postId":
                return "PostId";
            case "userNameId":
                return "UserNameId";
            default:
                return field;
        }
    },

    zodSchema: z.object({
        content: z.string().min(1),
        todoId: z.string().optional(),
        postId: z.string().optional(),
        userNameId: z.string().min(1),
    }),

    toInput(form: Partial<Record<CommentEditableKeys, unknown>>) {
        const f = form as Partial<
            Pick<CommentType, "content" | "todoId" | "postId" | "userNameId">
        >;
        const input = {
            content: f.content,
            todoId: f.todoId,
            postId: f.postId,
            userNameId: f.userNameId,
        } satisfies Partial<CommentType>;
        return input;
    },

    relations: {
        manyToManyKeys: [] as const,
    },
} as const;

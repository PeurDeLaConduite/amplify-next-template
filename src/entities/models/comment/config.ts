// AUTO-GENERATED – DO NOT EDIT
import type { CommentType } from "./types";
import { z } from "zod";

export type CommentEditableKeys =
  | "content"
  | "todoId"
  | "userNameId";

export const commentConfig = {
  model: "Comment" as const,

  fields: [
    "content",
    "todoId",
    "userNameId"
  ] as CommentEditableKeys[],

  labels(field: CommentEditableKeys): string {
    switch (field) {
    case "content": return "Content";
    case "todoId": return "TodoId";
    case "userNameId": return "UserNameId";
      default: return field;
    }
  },

  zodSchema: z.object({
  content: z.string().optional(),
  todoId: z.string().min(1),
  userNameId: z.string().min(1),
  }),

  toInput(form: Partial<Record<CommentEditableKeys, unknown>>) {
    const f = form as Partial<Pick<CommentType, "content" | "todoId" | "userNameId">>;
    const input = {
    content: f.content,
    todoId: f.todoId,
    userNameId: f.userNameId,
    } satisfies Partial<CommentType>;
    return input;
  },

  relations: {
    manyToManyKeys: [] as const
  }
} as const;

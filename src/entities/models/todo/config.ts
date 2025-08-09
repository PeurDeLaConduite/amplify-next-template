// AUTO-GENERATED – DO NOT EDIT
import type { TodoType } from "./types";
import { z } from "zod";

export type TodoEditableKeys =
  | "content";

export const todoConfig = {
  model: "Todo" as const,

  fields: [
    "content"
  ] as TodoEditableKeys[],

  labels(field: TodoEditableKeys): string {
    switch (field) {
    case "content": return "Content";
      default: return field;
    }
  },

  zodSchema: z.object({
  content: z.string().optional(),
  }),

  toInput(form: Partial<Record<TodoEditableKeys, unknown>>) {
    const f = form as Partial<Pick<TodoType, "content">>;
    const input = {
    content: f.content,
    } satisfies Partial<TodoType>;
    return input;
  },

  relations: {
    manyToManyKeys: [] as const
  }
} as const;

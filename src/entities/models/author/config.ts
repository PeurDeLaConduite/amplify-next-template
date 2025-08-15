// AUTO-GENERATED – DO NOT EDIT
import type { AuthorType } from "./types";
import { z } from "zod";

export type AuthorEditableKeys =
  | "authorName"
  | "bio"
  | "email"
  | "avatar"
  | "order";

export const authorConfig = {
  model: "Author" as const,

  fields: [
    "authorName",
    "bio",
    "email",
    "avatar",
    "order"
  ] as AuthorEditableKeys[],

  labels(field: AuthorEditableKeys): string {
    switch (field) {
    case "authorName": return "AuthorName";
    case "bio": return "Bio";
    case "email": return "Email";
    case "avatar": return "Avatar";
    case "order": return "Order";
      default: return field;
    }
  },

  zodSchema: z.object({
  authorName: z.string().min(1),
  bio: z.string().optional(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  order: z.number().optional(),
  }),

  toInput(form: Partial<Record<AuthorEditableKeys, unknown>>) {
    const f = form as Partial<Pick<AuthorType, "authorName" | "bio" | "email" | "avatar" | "order">>;
    const input = {
    authorName: f.authorName,
    bio: f.bio,
    email: f.email,
    avatar: f.avatar,
    order: f.order,
    } satisfies Partial<AuthorType>;
    return input;
  },

  relations: {
    manyToManyKeys: [] as const
  }
} as const;

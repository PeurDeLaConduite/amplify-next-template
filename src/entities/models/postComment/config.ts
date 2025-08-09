// AUTO-GENERATED – DO NOT EDIT
import type { PostCommentType } from "./types";
import { z } from "zod";

export type PostCommentEditableKeys =
  | "content"
  | "postId"
  | "userNameId";

export const postCommentConfig = {
  model: "PostComment" as const,

  fields: [
    "content",
    "postId",
    "userNameId"
  ] as PostCommentEditableKeys[],

  labels(field: PostCommentEditableKeys): string {
    switch (field) {
    case "content": return "Content";
    case "postId": return "PostId";
    case "userNameId": return "UserNameId";
      default: return field;
    }
  },

  zodSchema: z.object({
  content: z.string().min(1),
  postId: z.string().min(1),
  userNameId: z.string().min(1),
  }),

  toInput(form: Partial<Record<PostCommentEditableKeys, unknown>>) {
    const f = form as Partial<Pick<PostCommentType, "content" | "postId" | "userNameId">>;
    const input = {
    content: f.content,
    postId: f.postId,
    userNameId: f.userNameId,
    } satisfies Partial<PostCommentType>;
    return input;
  },

  relations: {
    manyToManyKeys: [] as const
  }
} as const;

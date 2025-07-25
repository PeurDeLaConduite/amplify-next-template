import type { Schema } from "@/amplify/data/resource";

export type PostComment = Schema["PostComment"]["type"];

export type PostCommentCreateInput = Omit<PostComment, "id" | "createdAt" | "updatedAt">;

export type PostCommentUpdateInput = Partial<PostCommentCreateInput>;

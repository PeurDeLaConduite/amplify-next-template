import type { Schema } from "@/amplify/data/resource";

export type Comment = Schema["Comment"]["type"];

export type CommentCreateInput = Omit<Comment, "id" | "createdAt" | "updatedAt">;

export type CommentUpdateInput = Partial<CommentCreateInput>;

import type { Schema } from "@/amplify/data/resource";

export type Post = Schema["Post"]["type"];

export type PostCreateInput = Omit<Post, "id" | "createdAt" | "updatedAt">;

export type PostUpdateInput = Partial<PostCreateInput>;

import type { Schema } from "@/amplify/data/resource";

export type PostTag = Schema["PostTag"]["type"];

export type PostTagCreateInput = Omit<PostTag, "id" | "createdAt" | "updatedAt">;

export type PostTagUpdateInput = Partial<PostTagCreateInput>;
import type { Schema } from "@/amplify/data/resource";

export type Author = Schema["Author"]["type"];

export type AuthorCreateInput = Omit<Author, "id" | "createdAt" | "updatedAt">;

export type AuthorUpdateInput = Partial<AuthorCreateInput>;

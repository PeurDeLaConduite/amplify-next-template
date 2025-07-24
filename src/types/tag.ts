import type { Schema } from "@/amplify/data/resource";

export type Tag = Schema["Tag"]["type"];

export type TagCreateInput = Omit<Tag, "id" | "createdAt" | "updatedAt">;

export type TagUpdateInput = Partial<TagCreateInput>;

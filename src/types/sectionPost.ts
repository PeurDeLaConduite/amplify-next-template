import type { Schema } from "@/amplify/data/resource";

export type SectionPost = Schema["SectionPost"]["type"];

export type SectionPostCreateInput = Omit<SectionPost, "id" | "createdAt" | "updatedAt">;

export type SectionPostUpdateInput = Partial<SectionPostCreateInput>;
import type { Schema } from "@/amplify/data/resource";

export type Section = Schema["Section"]["type"];

export type SectionCreateInput = Omit<Section, "id" | "createdAt" | "updatedAt">;

export type SectionUpdateInput = Partial<SectionCreateInput>;

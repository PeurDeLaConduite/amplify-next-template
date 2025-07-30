// @src/types/amplifyBaseTypes.ts

import type { Schema } from "@/amplify/data/resource";

/**
 * Utilitaire générique pour tous les types basés sur un modèle Schema
 */
export type BaseModel<K extends keyof Schema> = Schema[K]["type"];

export type CreateOmit<K extends keyof Schema> = Omit<
    BaseModel<K>,
    "id" | "createdAt" | "updatedAt"
>;

export type UpdateInput<K extends keyof Schema> = Partial<CreateOmit<K>>;

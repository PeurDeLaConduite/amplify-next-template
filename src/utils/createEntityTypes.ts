import type { Schema } from "@/amplify/data/resource";
import type { BaseModel, CreateOmit, UpdateInput } from "@/src/types/amplifyBaseTypes";

/**
 * Génère les types de base pour une entité du schéma Amplify
 */
export type EntityTypes<K extends keyof Schema> = {
    Model: BaseModel<K>;
    Omit: CreateOmit<K>;
    UpdateInput: UpdateInput<K>;
};

// Utilitaire simplement typé pour factoriser la déclaration des modèles
// Usage :
//   type MyTypes = EntityTypes<"Post">;
//   type Post = MyTypes["Model"];
//   ...
export function createEntityTypes<K extends keyof Schema>() {
    return null as unknown as EntityTypes<K>;
}

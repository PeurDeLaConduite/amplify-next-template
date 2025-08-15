// src/entities/core/types/form.ts

import type { ModelConfig } from "./config";

/**
 * Représentation générique d'un formulaire basé sur une configuration de modèle.
 */
export type FormState<C extends ModelConfig> = {
    [K in keyof C["fields"]]?: unknown;
};

/**
 * Mode d'édition d'un formulaire.
 */
export type EditMode = "create" | "edit";

/**
 * Résultat d'une validation de formulaire.
 */
export interface ValidationResult {
    valid: boolean;
    errors?: Record<string, string>;
}

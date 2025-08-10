// src/entities/core/utils/createModelForm.ts

/**
 * Génère un couple { initialForm, toForm } pour un modèle spécifique.
 * Cela permet de centraliser la logique de transformation des données.
 */
export function createModelForm<M, F, A extends unknown[] = unknown[]>(
    initialForm: F,
    toForm: (model: M, ...args: A) => F
) {
    return {
        initialForm,
        toForm,
    } as const;
}

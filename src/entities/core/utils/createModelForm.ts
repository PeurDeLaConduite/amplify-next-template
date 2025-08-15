// src/entities/core/utils/createModelForm.ts

/**
 * Génère un objet regroupant toutes les fonctions nécessaires à la
 * manipulation d'un formulaire basé sur un modèle spécifique.
 */

export function createModelForm<M, F, A extends unknown[] = [], O>(
    initialForm: F,
    toForm: (model: M, ...args: A) => F,
    toInput: (form: F) => O
) {
    return {
        initialForm,
        toForm,
        toInput,
    } as const;
}

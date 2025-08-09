/**
 * Génère un trio { initialForm, toForm, toInput } pour un modèle spécifique.
 * Cela permet de centraliser la logique de transformation des données.
 */
export function createModelForm<M, F, A extends unknown[] = unknown[], I = unknown>(
    initialForm: F,
    toForm: (model: M, ...args: A) => F,
    toInput?: (form: F) => I
) {
    return {
        initialForm,
        toForm,
        toInput,
    } as const;
}

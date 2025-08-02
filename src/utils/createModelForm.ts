import type { Schema } from "@/amplify/data/resource";
import type { CreateOmit } from "@/src/types/amplifyBaseTypes";
import type { SeoOmit } from "@/src/types/models/seo";

/**
 * Type générique représentant la structure d'un formulaire basé sur un modèle.
 *
 * @typeParam K - Nom du modèle dans le schéma Amplify.
 * @typeParam O - Propriétés du modèle à exclure du formulaire.
 * @typeParam R - Relations représentées par des listes d'identifiants.
 * @typeParam S - Indique si le modèle possède un champ SEO imbriqué.
 */
export type ModelForm<
    K extends keyof Schema,
    O extends keyof CreateOmit<K> = never,
    R extends string = never,
    S extends boolean = false,
> = Omit<CreateOmit<K>, O | (S extends true ? "seo" : never)> &
    (S extends true ? { seo: SeoOmit } : Record<never, never>) & {
        [P in R as `${P}Ids`]: string[];
    };

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

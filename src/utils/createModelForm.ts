// src/types/modelForm.ts
import type { Schema } from "@/amplify/data/resource";
import type { CreateOmit } from "@/src/types/amplifyBaseTypes";

/**
 * Type générique représentant la structure d'un formulaire basé sur un modèle,
 * avec un mapping dynamique pour gérer les CustomTypes.
 *
 * @typeParam K - Modèle Amplify.
 * @typeParam O - Champs du modèle à exclure.
 * @typeParam R - Relations converties en identifiants.
 * @typeParam CTMap - Mapping injecté des CustomTypes.
 * @typeParam CT - Clés sélectionnées dans CTMap.
 */
export type ModelForm<
  K extends keyof Schema,
  O extends keyof CreateOmit<K> = never,
  R extends string = never,
  CTMap extends Record<string, unknown> = Record<string, never>,
  CT extends keyof CTMap = never,
> =
  Omit<CreateOmit<K>, O | R | CT> &
  { [P in CT]: CTMap[P] } &
  { [P in R as `${P}Ids`]: string[] };
  
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

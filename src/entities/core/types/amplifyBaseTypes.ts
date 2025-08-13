// src/entities/core/types/amplifyBaseTypes.ts

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
> = Omit<CreateOmit<K>, O | R | CT> & { [P in CT]: CTMap[P] } & { [P in R as `${P}Ids`]: string[] };

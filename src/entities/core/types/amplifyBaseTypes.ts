import type { Schema } from "@/amplify/data/resource";

/** Identifiant “Amplify” (UUID ou sub Cognito selon le modèle) */
export type AmplifyId = string;
/** Résultat standardisé pour les listes Amplify */
export interface AmplifyListResult<T> {
    data: T[];
    nextToken?: string;
}

/** Type du modèle tel que généré par Amplify (avec relations & timestamps) */
export type BaseModel<K extends keyof Schema> = Schema[K]["type"];

/** Champs “créables” côté client : on retire id + timestamps */
export type CreateOmit<K extends keyof Schema> = Omit<
    BaseModel<K>,
    "id" | "createdAt" | "updatedAt"
>;

/** Champs “updatables” : partiel des champs créables */
export type UpdateInput<K extends keyof Schema> = Partial<CreateOmit<K>>;

/** Utilitaire : transforme une liste de noms de relations en champs `${name}Ids`: string[] */
type RelationIds<R extends string> = { [P in R as `${P}Ids`]: AmplifyId[] };

/**
 * Formulaire typé à partir d’un modèle Amplify.
 *
 * - K  : clé du modèle dans Schema.
 * - O  : champs à exclure du formulaire (ex: relations matérialisées, champs calculés…).
 * - R  : noms de relations à convertir en `${name}Ids: string[]` côté formulaire.
 * - CTMap : mapping de types personnalisés (CustomTypes) que tu veux injecter.
 * - CT : clés de CTMap à inclure dans le formulaire.
 */
export type ModelForm<
    K extends keyof Schema,
    O extends keyof CreateOmit<K> = never,
    R extends string = never,
    CTMap extends Record<string, unknown> = Record<string, never>,
    CT extends keyof CTMap = never,
> =
    // on retire du modèle les champs non voulus (O), les relations (R) et les CT sélectionnés (CT)
    Omit<CreateOmit<K>, O | R | CT> &
        // on injecte les CustomTypes sélectionnés
        { [P in CT]: CTMap[P] } &
        // on remplace les relations par des listes d'IDs
        RelationIds<R>;

/* --------- Utilitaires facultatifs (communs et sûrs) --------- */

/** Argument standard “par id” pour get/delete/update */
export type IdArg = { id: AmplifyId };

/** On retire les timestamps (utile si besoin hors CreateOmit/UpdateInput) */
export type WithoutTimestamps<T> = Omit<T, "createdAt" | "updatedAt">;

/** Petit alias pour “retirer des clés” tout en restant lisible */
export type Without<T, K extends keyof T> = Omit<T, K>;

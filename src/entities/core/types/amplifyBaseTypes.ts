// src/entities/core/types/amplifyBaseTypes.ts
import type { Schema } from "@/amplify/data/resource";

/** Clé de modèle côté Amplify */
export type ModelKey = keyof Schema;

/** Modèle “brut” tel que défini par Amplify */
export type BaseModel<K extends ModelKey> = Schema[K]["type"];

/** Données “créables” (sans id/createdAt/updatedAt) */
export type CreateOmit<K extends ModelKey> = Omit<BaseModel<K>, "id" | "createdAt" | "updatedAt">;

/** Alias conviviaux (optionnels) */
export type CreateData<K extends ModelKey> = CreateOmit<K>;
export type UpdateInput<K extends ModelKey> = Partial<CreateOmit<K>>;
/** Payload d’update côté API (avec id) */
export type UpdateDataWithId<K extends ModelKey> = UpdateInput<K> & { id: string };

/**
 * Type générique de formulaire pour un modèle :
 * - O : champs exclus du form
 * - R : relations converties en *Ids: string[]
 * - CTMap/CT : mapping de CustomTypes (CTMap[P] remplace P)
 */
export type ModelForm<
    K extends ModelKey,
    O extends keyof CreateOmit<K> = never,
    R extends string = never,
    CTMap extends Record<string, unknown> = Record<string, never>,
    CT extends keyof CTMap = never,
> = Omit<CreateOmit<K>, O | R | CT> & { [P in CT]: CTMap[P] } & { [P in R as `${P}Ids`]: string[] };

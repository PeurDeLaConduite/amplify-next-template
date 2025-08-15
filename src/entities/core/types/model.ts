// src/entities/core/types/model.ts

/** Identifiant générique d'un modèle. */
export type ModelId = string;

/** Champs de suivi temporel communs à toutes les entités. */
export interface Timestamps {
    createdAt: string;
    updatedAt: string;
}

/** Représente une entité de base avec identifiant et timestamps. */
export interface BaseEntity extends Timestamps {
    id: ModelId;
}

/** Relation optionnelle vers une autre entité. */
export type Relation<T> = T | null;

/** Collection relationnelle. */
export type RelationArray<T> = T[];

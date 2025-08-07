// src/entities/models/userName/service.ts
import { client } from "@src/services";
import type { UserNameType } from "./types";
/**
 * Crée un nouveau record UserName pour l'utilisateur
 * @param sub  Sub Cognito (id du user)
 * @param name Le pseudo à créer
 */
export async function createUserName(sub: string, name: string) {
    return client.models.UserName.create({
        id: sub,
        userName: name,
        owner: sub,
    });
}

/**
 * Met à jour le record UserName existant
 * @param sub  Sub Cognito (id du user)
 * @param name Le pseudo à mettre à jour
 */
export async function updateUserName(sub: string, name: string) {
    return client.models.UserName.update({
        id: sub,
        userName: name,
        owner: sub,
    });
}

/**
 * Récupère le pseudo courant (ou renvoie null)
 * @param sub Sub Cognito
 */
export async function getUserName(sub: string) {
    const { data } = await client.models.UserName.get({ id: sub });
    return data ?? null;
}
export async function deleteUserName(sub: string) {
    return client.models.UserName.delete({ id: sub });
}

/**
 * Observe en temps réel le pseudo utilisateur
 * @param sub Sub Cognito
 * @param onChange Callback appelé à chaque changement
 */
export function observeUserName(sub: string, onChange: (item: UserNameType | null) => void) {
    return client.models.UserName.observeQuery({}).subscribe({
        next: ({ items }) => {
            const item = items.find((u) => u.id === sub) ?? null;
            onChange(item as UserNameType | null);
        },
        error: console.error,
    });
}

export const userNameService = {
    create: createUserName,
    update: updateUserName,
    get: getUserName,
    observe: observeUserName,
    delete: deleteUserName,
};

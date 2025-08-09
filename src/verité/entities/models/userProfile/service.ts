// src/lib/userProfileService.ts

import { type Schema, client } from "@src/services";

/** CREATE */
export async function createUserProfile(
    sub: string,
    data: Pick<
        Schema["UserProfile"]["type"],
        "firstName" | "familyName" | "address" | "postalCode" | "city" | "country" | "phoneNumber"
    >
) {
    return client.models.UserProfile.create({ id: sub, ...data });
}

/** UPDATE (partial) */
export async function updateUserProfile(sub: string, data: Partial<Schema["UserProfile"]["type"]>) {
    return client.models.UserProfile.update({ id: sub, ...data });
}

/** DELETE  🔥  (fonction manquante précédemment) */
export async function deleteUserProfile(sub: string) {
    return client.models.UserProfile.delete({ id: sub });
}

/** READ (one‑shot) */
export async function getUserProfile(sub: string) {
    const { data } = await client.models.UserProfile.get({ id: sub });
    return data ?? null;
}

/** OBSERVE (temps‑réel) – facultatif : renvoie la subscription pour `unsubscribe()` */
export function observeUserProfile(
    sub: string,
    onChange: (profile: Schema["UserProfile"]["type"] | null) => void
) {
    return client.models.UserProfile.observeQuery({}).subscribe({
        next: ({ items }) => {
            const item = items.find((p) => p.id === sub) ?? null;
            onChange(item as Schema["UserProfile"]["type"] | null);
        },
        error: console.error,
    });
}

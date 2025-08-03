import { client } from "@/src/services";
import type { UserProfileType } from "./types";

/** CREATE */
export async function createUserProfile(
    sub: string,
    data: Pick<
        UserProfileType,
        "firstName" | "familyName" | "address" | "postalCode" | "city" | "country" | "phoneNumber"
    >
) {
    return client.models.UserProfile.create({ id: sub, ...data });
}

/** UPDATE (partial) */
export async function updateUserProfile(sub: string, data: Partial<UserProfileType>) {
    return client.models.UserProfile.update({ id: sub, ...data });
}

/** DELETE */
export async function deleteUserProfile(sub: string) {
    return client.models.UserProfile.delete({ id: sub });
}

/** OBSERVE */
export function observeUserProfile(
    sub: string,
    onChange: (profile: UserProfileType | null) => void
) {
    return client.models.UserProfile.observeQuery({}).subscribe({
        next: ({ items }) => {
            const item = items.find((p) => p.id === sub) ?? null;
            onChange(item as UserProfileType | null);
        },
        error: console.error,
    });
}

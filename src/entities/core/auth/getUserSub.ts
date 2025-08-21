import { getCurrentUser } from "aws-amplify/auth";

// src/entities/core/auth/getUserSub.ts
export async function tryGetUserSub(): Promise<string | null> {
    try {
        const u = await getCurrentUser();
        return u.userId ?? (u as any)?.attributes?.sub ?? u.username ?? null;
    } catch {
        return null;
    }
}

export async function getUserSub(): Promise<string> {
    const sub = await tryGetUserSub();
    if (!sub) throw new Error("User not authenticated");
    return sub;
}

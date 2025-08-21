import { getCurrentUser } from "aws-amplify/auth";

// src/entities/core/auth/getUserSub.ts
export async function getUserSub(): Promise<string> {
    const u = await getCurrentUser();
    return u.userId ?? (u as any)?.attributes?.sub ?? u.username;
}

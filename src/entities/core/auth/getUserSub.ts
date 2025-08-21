import { getCurrentUser } from "aws-amplify/auth";

export async function getUserSub(): Promise<string> {
    const { userId } = await getCurrentUser();
    return userId;
}
// src/entities/core/auth/getUserSub.ts

// export async function getUserSub(): Promise<string> {
//     const u = await getCurrentUser();
//     return u.userId ?? (u as any)?.attributes?.sub ?? u.username; // robustesse
// }

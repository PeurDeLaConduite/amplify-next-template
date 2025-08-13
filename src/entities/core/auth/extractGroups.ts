// src/entities/core/auth/extractGroups.ts
export function extractGroups(u: unknown): string[] {
    const anyU = u as any;
    const g =
        anyU?.tokens?.idToken?.payload?.["cognito:groups"] ??
        anyU?.tokens?.accessToken?.payload?.["cognito:groups"] ??
        anyU?.signInUserSession?.idToken?.payload?.["cognito:groups"] ??
        anyU?.signInUserSession?.accessToken?.payload?.["cognito:groups"];
    return Array.isArray(g) ? g : typeof g === "string" ? [g] : [];
}

// src/entities/core/auth/extractGroups.ts
// src/entities/core/auth/extractGroups.ts
export function extractGroups(u: unknown): string[] {
    const candidates: string[][] = [
        ["tokens", "idToken", "payload", "cognito:groups"],
        ["tokens", "accessToken", "payload", "cognito:groups"],
        ["signInUserSession", "idToken", "payload", "cognito:groups"],
        ["signInUserSession", "accessToken", "payload", "cognito:groups"],
    ];

    for (const path of candidates) {
        const value = getPath(u, path);
        const groups = toStringArray(value);
        if (groups.length > 0) return groups;
    }
    return [];
}

function getPath(source: unknown, path: string[]): unknown {
    let cur: unknown = source;
    for (const key of path) {
        if (!isRecord(cur)) return undefined;
        cur = cur[key];
    }
    return cur;
}

function isRecord(x: unknown): x is Record<string, unknown> {
    return typeof x === "object" && x !== null;
}

function toStringArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
    if (typeof value === "string") return [value];
    return [];
}

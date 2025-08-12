import type { AuthRule } from "./types";

export interface UserProfile {
    roles?: string[];
    [key: string]: unknown;
}

export interface AuthUser {
    username?: string;
    groups?: string[];
    profile?: UserProfile;
}

export function canAccess(
    user: AuthUser | null,
    entity: Record<string, unknown>,
    rules: AuthRule[] = []
): boolean {
    for (const rule of rules) {
        switch (rule.allow) {
            case "owner": {
                const field = rule.ownerField ?? "owner";
                if (
                    user?.username &&
                    entity[field] !== undefined &&
                    entity[field] === user.username
                ) {
                    return true;
                }
                break;
            }
            case "groups": {
                if (user?.groups && rule.groups.some((g) => user.groups?.includes(g))) {
                    return true;
                }
                break;
            }
            case "profile": {
                const attr = rule.attribute;
                const value = user?.profile?.[attr];
                if (Array.isArray(value)) {
                    if (value.some((v) => rule.values.includes(v as string | number | boolean))) {
                        return true;
                    }
                } else if (
                    value !== undefined &&
                    rule.values.includes(value as string | number | boolean)
                ) {
                    return true;
                }
                break;
            }
            case "public":
                return true;
            case "private":
                if (user) {
                    return true;
                }
                break;
            default:
                return false;
        }
    }
    return false;
}

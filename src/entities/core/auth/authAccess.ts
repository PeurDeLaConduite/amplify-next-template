// src/entities/core/auth/access.ts
import type { AuthRule, AuthUser, Operation } from "../types";

export function canAccessOp(
    user: AuthUser | null,
    entityOrData: Record<string, unknown> | undefined,
    rules: AuthRule[] = [],
    op: Operation
): boolean {
    for (const rule of rules) {
        if (!rule.operations.includes(op)) continue;

        switch (rule.allow) {
            case "public":
                return true;
            case "private":
                if (user) return true;
                break;
            case "owner": {
                const field = rule.ownerField ?? "owner";
                if (!user?.username) break;
                const owner = entityOrData?.[field];
                if (owner !== undefined && owner === user.username) return true;
                break;
            }
            case "groups":
                if (user?.groups?.length && rule.groups?.some((g) => user.groups!.includes(g)))
                    return true;
                break;
            case "profile": {
                const v = user?.profile?.[rule.field ?? ""];
                if (Array.isArray(v)) {
                    if (rule.values?.some((val) => (v as unknown[]).includes(val))) return true;
                } else if (v !== undefined) {
                    if (rule.values?.includes(v as never)) return true;
                }
                break;
            }
        }
    }
    return false;
}

// Raccourci lecture
export function canAccess(
    user: AuthUser | null,
    entity: Record<string, unknown>,
    rules: AuthRule[] = []
): boolean {
    return canAccessOp(user, entity, rules, "read");
}

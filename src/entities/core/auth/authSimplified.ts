// src/entities/core/auth/simplified.ts
import type { AuthRule, SimplePolicy, SimpleAccess } from "../types";

const asArray = <T>(v: T | T[] | undefined): T[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

export function expandPolicy(p: SimplePolicy): AuthRule[] {
    const out: AuthRule[] = [];

    const push = (
        allow: AuthRule["allow"],
        operations: AuthRule["operations"],
        extra?: Partial<AuthRule>
    ) => out.push({ allow, operations, ...extra });

    const add = (op: "read" | "create" | "update" | "delete", access: SimpleAccess) => {
        if (access === "public") return push("public", [op]);
        if (access === "private" || access === "authenticated") return push("private", [op]);
        if ("groups" in access) return push("groups", [op], { groups: access.groups });
        if ("owner" in access || "ownerField" in access)
            return push("owner", [op], { ownerField: access.ownerField ?? "owner" });
        if ("profile" in access)
            return push("profile", [op], {
                field: access.profile.field,
                values: access.profile.values,
            });
    };

    (["read", "create", "update", "delete"] as const).forEach((op) => {
        asArray(p[op]).forEach((acc) => add(op, acc));
    });

    return dedupeRules(out);
}

function dedupeRules(rules: AuthRule[]): AuthRule[] {
    const seen = new Set<string>();
    const res: AuthRule[] = [];
    for (const r of rules) {
        const key = JSON.stringify([
            r.allow,
            [...r.operations].sort().join(","),
            r.ownerField ?? "",
            (r.groups ?? []).slice().sort().join("|"),
            r.field ?? "",
            (r.values ?? []).slice().sort().join("|"),
        ]);
        if (!seen.has(key)) {
            seen.add(key);
            res.push(r);
        }
    }
    return res;
}

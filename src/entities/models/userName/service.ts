// src/entities/models/userName/service.ts
import { crudService } from "@entities/core";
import type { AuthUser, AuthRule } from "@entities/core/types";

const rules: AuthRule[] = [
    { allow: "public", operations: ["read"] },
    { allow: "private", operations: ["create", "read", "delete"] },
    { allow: "owner", operations: ["read", "update", "delete"], ownerField: "owner" },
];

export const userNameService = (user: AuthUser | null) =>
    crudService("UserName", user, rules, { autoOwnerField: "owner" });

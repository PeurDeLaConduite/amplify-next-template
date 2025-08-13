// src/entities/models/userName/service.ts
import { crudService, type AuthUser, type SimplePolicy, expandPolicy } from "@entities/core";

const policy: SimplePolicy = {
    read: { owner: true },
    create: { owner: true },
    update: { owner: true },
    delete: { owner: true },
};
const rules = expandPolicy(policy);

export const userNameService = (user: AuthUser | null) =>
    crudService("UserName", user, rules, { autoOwnerField: "owner" });

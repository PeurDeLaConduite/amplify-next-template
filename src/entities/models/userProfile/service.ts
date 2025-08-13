// src/entities/models/userProfile/service.ts
import { crudService, type AuthUser, type SimplePolicy, expandPolicy } from "@entities/core";

const policy: SimplePolicy = {
    read: { owner: true },
    create: { owner: true },
    update: { owner: true },
    delete: { owner: true },
};
const rules = expandPolicy(policy);

export const userProfileService = (user: AuthUser | null) =>
    crudService("UserProfile", user, rules, { autoOwnerField: "owner" });

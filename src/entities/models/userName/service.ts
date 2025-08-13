// src/entities/models/userName/service.ts
import { crudService } from "@entities/core";
import { expandPolicy } from "@entities/core/auth";
import type { AuthUser, SimplePolicy } from "@entities/core/types";

const userNamePolicy: SimplePolicy = {
    read: ["public", "private", { owner: true, ownerField: "owner" }],
    create: "private",
    update: { owner: true, ownerField: "owner" },
    delete: ["private", { owner: true, ownerField: "owner" }],
};
const userNameRules = expandPolicy(userNamePolicy);

export const userNameService = (user: AuthUser | null) =>
    crudService("UserName", user, userNameRules, { autoOwnerField: "owner" });

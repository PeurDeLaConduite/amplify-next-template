import { crudService } from "@entities/core";
import type { AuthUser, SimplePolicy } from "@entities/core/types";
import { expandPolicy } from "@entities/core/auth";

const policy: SimplePolicy = {
    read: ["public", "private"],
    create: { groups: ["ADMINS"] },
    update: { groups: ["ADMINS"] },
    delete: { groups: ["ADMINS"] },
};
const rules = expandPolicy(policy);

export const tagService = (user: AuthUser | null) => crudService("Tag", user, rules);

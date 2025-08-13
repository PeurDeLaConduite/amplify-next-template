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

export const postService = (user: AuthUser | null) => crudService("Post", user, rules);

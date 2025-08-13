// src/entities/models/author/service.ts
import { crudService } from "@entities/core";
import type { AuthUser, SimplePolicy } from "@entities/core/types";
import { expandPolicy } from "@entities/core/auth";

const authorPolicy: SimplePolicy = {
    read: ["public", "private"],
    create: { groups: ["ADMINS"] },
    update: { groups: ["ADMINS"] },
    delete: { groups: ["ADMINS"] },
};
const authorRules = expandPolicy(authorPolicy);

export const authorService = (user: AuthUser | null) => crudService("Author", user, authorRules);

// src/entities/models/author/service.ts
import { crudService } from "@entities/core";
import type { AuthUser } from "@entities/core/types";
import { expandPolicy } from "@entities/core/auth/authSimplified";

// Règles simples (miroir de ton schéma Amplify)
const authorPolicy = {
    read: ["public", "private"], // publicApiKey + authenticated -> read (list/get)
    create: { groups: ["ADMINS"] },
    update: { groups: ["ADMINS"] },
    delete: { groups: ["ADMINS"] },
} as const;

const authorRules = expandPolicy(authorPolicy);

export const authorService = (user: AuthUser | null) => crudService("Author", user, authorRules);

// src/entities/relations/sectionPost/service.ts
import { relationService } from "@entities/core";
import type { AuthUser, SimplePolicy } from "@entities/core/types";
import { expandPolicy } from "@entities/core/auth";

const sectionPostPolicy: SimplePolicy = {
    read: ["public", "private"],
    create: { groups: ["ADMINS"] },
    update: { groups: ["ADMINS"] },
    delete: { groups: ["ADMINS"] },
};
const sectionPostRules = expandPolicy(sectionPostPolicy);

export const sectionPostService = (user: AuthUser | null) =>
    relationService("SectionPost", user, sectionPostRules, "sectionId", "postId");

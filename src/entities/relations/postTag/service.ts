import { relationService } from "@entities/core";
import type { AuthUser, SimplePolicy } from "@entities/core/types";
import { expandPolicy } from "@entities/core/auth";

const postTagPolicy: SimplePolicy = {
    read: ["public", "private"],
    create: { groups: ["ADMINS"] },
    update: { groups: ["ADMINS"] },
    delete: { groups: ["ADMINS"] },
};
const postTagRules = expandPolicy(postTagPolicy);

export const postTagService = (user: AuthUser | null) =>
    relationService("PostTag", user, postTagRules, "postId", "tagId");

// src/entities/models/userProfile/service.ts
import { crudService } from "@entities/core";
import type {
    UserProfileTypeCreateInput,
    UserProfileTypeUpdateInput,
} from "@entities/models/userProfile/types";

export const userProfileService = crudService<
    "UserProfile",
    UserProfileTypeCreateInput,
    UserProfileTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("UserProfile", {
    auth: { read: "userPool", write: "userPool" },
});

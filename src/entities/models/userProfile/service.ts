// src/entities/models/userProfile/service.ts
import { crudService } from "@entities/core";
import type {
    UserProfileTypeOmit,
    UserProfileTypeUpdateInput,
} from "@entities/models/userProfile/types";

export const userProfileService = crudService<
    "UserProfile",
    UserProfileTypeOmit & { id: string },
    UserProfileTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("UserProfile", {
    auth: { read: "userPool", write: "userPool" },
});

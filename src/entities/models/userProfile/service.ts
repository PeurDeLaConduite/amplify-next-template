// src/entities/models/userProfile/service.ts
import { crudService } from "@entities/core";
import type {
    UserProfileTypeOmit,
    UserProfileTypeUpdateInput,
} from "@entities/models/userProfile/types";

export const userProfileService = crudService<
    "UserProfile",
    UserProfileTypeOmit,
    UserProfileTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("UserProfile", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

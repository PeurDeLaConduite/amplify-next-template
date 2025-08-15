// src/entities/models/userProfile/service.ts
import { crudService } from "@entities/core";
import type { UserProfileTypeCreateInput, UserProfileTypeUpdateInput } from "./types";
import type { IdArg } from "@entities/core/types";

export const userProfileService = crudService<
    "UserProfile",
    UserProfileTypeCreateInput,
    UserProfileTypeUpdateInput,
    IdArg,
    IdArg
>("UserProfile", {
    auth: { read: ["userPool"], write: "userPool" },
});

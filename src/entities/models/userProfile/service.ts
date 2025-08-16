// src/entities/models/userProfile/service.ts
import { crudService } from "@entities/core/services/crudService";
export const userProfileService = crudService("UserProfile", {
    auth: { read: "userPool", write: "userPool" },
});

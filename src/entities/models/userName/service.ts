// src/entities/models/userName/service.ts
import { crudService } from "@entities/core/services/crudService";
export const userNameService = crudService("UserName", {
    auth: { read: "apiKey", write: "userPool" },
});

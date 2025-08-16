// src/entities/models/userName/service.ts
import { crudService } from "@entities/core/services/crudService";

// ✅ Lecture en public (API key), écritures avec User Pool
export const userNameService = crudService("UserName", {
    auth: { read: "apiKey", write: "userPool" },
});

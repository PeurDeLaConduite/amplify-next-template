// src/entities/models/userName/service.ts
import { crudService } from "@entities/core/services/crudService";
import type { UserNameCreateInput, UserNameUpdateInput } from "@entities/models/userName/types";

// ✅ Lecture en public (API key), écritures avec User Pool
export const userNameService = crudService<
    "UserName",
    UserNameCreateInput & { id: string },
    UserNameUpdateInput & { id: string },
    { id: string },
    { id: string }
>("UserName", {
    auth: { read: "apiKey", write: "userPool" },
});

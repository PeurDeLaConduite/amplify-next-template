// src/entities/models/userName/service.ts
import { crudService } from "@entities/core";
import type {
    UserNameTypeCreateInput,
    UserNameTypeUpdateInput,
} from "@entities/models/userName/types";

// ✅ Lecture publique (API Key ou User Pool) & écriture via User Pool
const base = crudService<
    "UserName",
    UserNameTypeCreateInput & { id: string },
    UserNameTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("UserName", {
    auth: { read: ["userPool", "apiKey"], write: "userPool" },
});

export const userNameService = {
    ...base,
    defaultSelection: ["id", "userName"] as const,
};

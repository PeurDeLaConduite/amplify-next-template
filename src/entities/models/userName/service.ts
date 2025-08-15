import { crudService } from "@entities/core/services/crudService";
import type { IdArg } from "@entities/core/types";

// DTO plats pour ce service (clairs et non-nullables côté API)
export type UserNameCreateInput = { id: string; userName: string };
export type UserNameUpdateInput = { id: string; userName?: string };

export const userNameService = crudService<
    "UserName",
    UserNameCreateInput,
    UserNameUpdateInput,
    IdArg,
    IdArg
>("UserName", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

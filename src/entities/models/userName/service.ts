// src/entities/models/userName/service.ts
import { crudService } from "@entities/core";
import type { UserNameTypeCreateInput, UserNameTypeUpdateInput } from "./types";
import type { IdArg } from "@entities/core/types";

export const userNameService = crudService<
    "UserName",
    UserNameTypeCreateInput,
    UserNameTypeUpdateInput,
    IdArg,
    IdArg
>("UserName");

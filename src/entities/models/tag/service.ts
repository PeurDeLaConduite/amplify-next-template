import { crudService } from "@entities/core";
import type { TagTypeCreateInput, TagTypeUpdateInput } from "./types";
import type { IdArg } from "@entities/core/types";

export const tagService = crudService<"Tag", TagTypeCreateInput, TagTypeUpdateInput, IdArg, IdArg>(
    "Tag",
    {
        auth: { read: ["apiKey", "userPool"], write: "userPool" },
    }
);

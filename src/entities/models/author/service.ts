// src/entities/models/author/service.tsx

import { crudService } from "@entities/core";
import type { AuthorTypeUpdateInput, AuthorTypeCreateInput } from "./types";
import type { IdArg } from "@entities/core/types";

export const authorService = crudService<
    "Author",
    AuthorTypeCreateInput,
    AuthorTypeUpdateInput,
    IdArg,
    IdArg
>("Author", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

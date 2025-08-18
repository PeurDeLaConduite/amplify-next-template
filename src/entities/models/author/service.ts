import { crudService } from "@entities/core";
import type { AuthorTypeOmit, AuthorTypeUpdateInput } from "@entities/models/author/types";

export const authorService = crudService<
    "Author",
    Omit<AuthorTypeOmit, "posts">,
    AuthorTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Author", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

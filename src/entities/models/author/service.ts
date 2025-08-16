import { crudService } from "@entities/core";

export const authorService = crudService("Author", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

import { crudService } from "@entities/core";

export const tagService = crudService("Tag", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

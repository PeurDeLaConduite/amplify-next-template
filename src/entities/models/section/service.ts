import { crudService } from "@entities/core";

export const sectionService = crudService("Section", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

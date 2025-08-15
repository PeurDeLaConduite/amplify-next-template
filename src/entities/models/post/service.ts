import { crudService } from "@entities/core";

export const postService = crudService("Post", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

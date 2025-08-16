import { client, crudService } from "@src/entities/core";

export const todoService = crudService("Todo", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export function useTodoService() {
    return client.models.Todo;
}

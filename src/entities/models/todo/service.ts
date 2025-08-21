import { client, crudService } from "@src/entities/core";
import type { TodoTypeCreateInput, TodoTypeUpdateInput } from "@entities/models/todo/types";

export const todoService = crudService<
    "Todo",
    TodoTypeCreateInput,
    TodoTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Todo", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export function useTodoService() {
    return client.models.Todo;
}

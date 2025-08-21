import { todoSchema, initialTodoForm, toTodoForm, toTodoCreate, toTodoUpdate } from "./form";

export const todoConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["content"],
    relations: ["comments"],
    zodSchema: todoSchema,
    toForm: toTodoForm,
    toCreate: toTodoCreate,
    toUpdate: toTodoUpdate,
    initialForm: initialTodoForm,
};

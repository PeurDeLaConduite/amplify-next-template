import { z, type ZodType } from "zod";
import { createModelForm } from "@entities/core";
import type {
    TodoModel,
    TodoFormType,
    TodoTypeCreateInput,
    TodoTypeUpdateInput,
} from "@entities/models/todo/types";

export const {
    zodSchema: todoSchema,
    initialForm: initialTodoForm,
    toForm: toTodoForm,
    toCreate: toTodoCreate,
    toUpdate: toTodoUpdate,
} = createModelForm<TodoModel, TodoFormType, TodoTypeCreateInput, TodoTypeUpdateInput, [string[]]>({
    zodSchema: z.object({
        id: z.string().optional(),
        content: z.string(),
        commentIds: z.array(z.string()),
    }) as ZodType<TodoFormType>,
    initialForm: {
        id: "",
        content: "",
        commentIds: [],
    },
    toForm: (todo, commentIds: string[] = []) => ({
        id: todo.id ?? "",
        content: todo.content ?? "",
        commentIds,
    }),
    toCreate: (form: TodoFormType): TodoTypeCreateInput => {
        const { id, commentIds, ...values } = form;
        void id;
        void commentIds;
        return values as TodoTypeCreateInput;
    },
    toUpdate: (form: TodoFormType): TodoTypeUpdateInput => {
        const { commentIds, ...values } = form;
        void commentIds;
        return values;
    },
});

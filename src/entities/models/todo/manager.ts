import { createManager } from "@entities/core";
import { todoService } from "@entities/models/todo/service";
import type {
    TodoModel,
    TodoFormType,
    TodoCreateInput,
    TodoUpdateInput,
} from "@src/types/models/todo";

type Id = string;

const initialTodoForm: TodoFormType = {
    id: "",
    content: "",
    comments: [] as unknown as TodoModel["comments"],
};

function toTodoForm(todo: TodoModel): TodoFormType {
    return {
        id: todo.id ?? "",
        content: todo.content ?? "",
        comments: todo.comments ?? ([] as unknown as TodoModel["comments"]),
    };
}

function toTodoCreate(form: TodoFormType): TodoCreateInput {
    return { content: form.content || undefined };
}

function toTodoUpdate(form: TodoFormType): TodoUpdateInput {
    return { content: form.content || undefined } as TodoUpdateInput;
}

export function createTodoManager() {
    return createManager<TodoModel, TodoFormType, Id>({
        getInitialForm: () => ({ ...initialTodoForm }),
        listEntities: async ({ limit }) => {
            const { data } = await todoService.list({ limit });
            return { items: (data ?? []) as TodoModel[] };
        },
        getEntityById: async (id) => {
            const { data } = await todoService.get({ id });
            return (data ?? null) as TodoModel | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await todoService.create(toTodoCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await todoService.update({
                id,
                ...toTodoUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await todoService.delete({ id });
        },
        loadEntityForm: async (id) => {
            const { data } = await todoService.get({ id });
            if (!data) throw new Error("Todo not found");
            return toTodoForm(data as TodoModel);
        },
    });
}

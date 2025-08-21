import { createManager } from "@entities/core";
import { todoService } from "@entities/models/todo/service";
import { commentService } from "@entities/models/comment/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import {
    initialTodoForm,
    toTodoForm,
    toTodoCreate,
    toTodoUpdate,
} from "@entities/models/todo/form";
import type { TodoModel, TodoFormType } from "@entities/models/todo/types";
import type { CommentModel } from "@src/types/models/comment";

type Id = string;
type Extras = { comments: CommentModel[] };

export function createTodoManager() {
    return createManager<TodoModel, TodoFormType, Id, Extras>({
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
        updateEntity: async (id, patch, { form }) => {
            const { errors } = await todoService.update({
                id,
                ...toTodoUpdate({ ...form, ...patch }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await todoService.delete({ id });
        },
        loadExtras: async () => {
            const { data } = await commentService.list({ limit: 999 });
            return { comments: data ?? [] };
        },
        loadEntityForm: async (id) => {
            const [{ data }, { data: commentsData }] = await Promise.all([
                todoService.get({ id }),
                commentService.list({ limit: 999, filter: { todoId: { eq: id } } }),
            ]);
            if (!data) throw new Error("Todo not found");
            const commentIds = (commentsData ?? []).map((c) => c.id);
            return toTodoForm(data as TodoModel, commentIds);
        },
        syncManyToMany: async (id, link) => {
            const { data } = await commentService.list({ limit: 999 });
            const current = (data ?? []).filter((c) => c.todoId === id).map((c) => c.id);
            const target = link.replace ?? [
                ...new Set([
                    ...current.filter((x) => !(link.remove ?? []).includes(x)),
                    ...(link.add ?? []),
                ]),
            ];
            await syncNN(
                current,
                target,
                (commentId) => commentService.update({ id: commentId, todoId: id }),
                (commentId) => commentService.update({ id: commentId, todoId: null })
            );
        },
    });
}

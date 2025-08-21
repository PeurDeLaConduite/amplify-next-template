import { createManager } from "@entities/core";
import { commentService } from "./service";
import { userNameService } from "@entities/models/userName/service";
import { todoService } from "@entities/models/todo/service";
import { postService } from "@entities/models/post/service";
import { initialCommentForm, toCommentForm, toCommentCreate, toCommentUpdate } from "./form";
import type { CommentType, CommentFormType } from "./types";
import type { UserNameType } from "@entities/models/userName/types";
import type { TodoModel } from "@src/types/models/todo";
import type { PostType } from "@entities/models/post/types";

type Id = string;
type Extras = { userNames: UserNameType[]; todos: TodoModel[]; posts: PostType[] };

export function createCommentManager() {
    return createManager<CommentType, CommentFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialCommentForm }),
        listEntities: async ({ limit }) => {
            const { data } = await commentService.list({ limit });
            return { items: (data ?? []) as CommentType[] };
        },
        getEntityById: async (id) => {
            const { data } = await commentService.get({ id });
            return (data ?? null) as CommentType | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await commentService.create(toCommentCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, patch, { form }) => {
            const { errors } = await commentService.update({
                id,
                ...toCommentUpdate({ ...form, ...patch }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await commentService.delete({ id });
        },
        loadExtras: async () => {
            const [u, t, p] = await Promise.all([
                userNameService.list({ limit: 999 }),
                todoService.list({ limit: 999 }),
                postService.list({ limit: 999 }),
            ]);
            return {
                userNames: u.data ?? [],
                todos: t.data ?? [],
                posts: p.data ?? [],
            };
        },
        loadEntityForm: async (id) => {
            const { data } = await commentService.get({ id });
            if (!data) throw new Error("Comment not found");
            return toCommentForm(data as CommentType);
        },
    });
}

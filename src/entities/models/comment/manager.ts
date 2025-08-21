import { createManager } from "@entities/core";
import { commentService } from "@entities/models/comment/service";
import { userNameService } from "@entities/models/userName/service";
import { todoService } from "@entities/models/todo/service";
import { postService } from "@entities/models/post/service";
import type {
    CommentModel,
    CommentFormType,
    CommentCreateInput,
    CommentUpdateInput,
} from "@src/types/models/comment";
import type { UserNameType } from "@entities/models/userName/types";
import type { TodoModel } from "@src/types/models/todo";
import type { PostType } from "@entities/models/post/types";

type Id = string;
type Extras = { userNames: UserNameType[]; todos: TodoModel[]; posts: PostType[] };

const initialCommentForm: CommentFormType = {
    id: "",
    content: "",
    todoId: "",
    postId: "",
    userNameId: "",
    todo: null,
    post: null,
    userName: null,
};

function toCommentForm(comment: CommentModel): CommentFormType {
    return {
        id: comment.id ?? "",
        content: comment.content ?? "",
        todoId: comment.todoId ?? "",
        postId: comment.postId ?? "",
        userNameId: comment.userNameId ?? "",
        todo: comment.todo ?? null,
        post: comment.post ?? null,
        userName: comment.userName ?? null,
    };
}

function toCommentCreate(form: CommentFormType): CommentCreateInput {
    return {
        content: form.content,
        todoId: form.todoId || null,
        postId: form.postId || null,
        userNameId: form.userNameId || null,
    };
}

function toCommentUpdate(form: CommentFormType): CommentUpdateInput {
    return {
        content: form.content,
        todoId: form.todoId || null,
        postId: form.postId || null,
        userNameId: form.userNameId || null,
    } as CommentUpdateInput;
}

export function createCommentManager() {
    return createManager<CommentModel, CommentFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialCommentForm }),
        listEntities: async ({ limit }) => {
            const { data } = await commentService.list({ limit });
            return { items: (data ?? []) as CommentModel[] };
        },
        getEntityById: async (id) => {
            const { data } = await commentService.get({ id });
            return (data ?? null) as CommentModel | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await commentService.create(toCommentCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await commentService.update({
                id,
                ...toCommentUpdate({ ...form, ...data }),
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
            return toCommentForm(data as CommentModel);
        },
    });
}

import { createManager } from "@entities/core";
import { userNameService } from "@entities/models/userName/service";
import { commentService } from "@entities/models/comment/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import { getCurrentUser } from "aws-amplify/auth";
import {
    initialUserNameForm,
    toUserNameForm,
    toUserNameCreate,
    toUserNameUpdate,
} from "@entities/models/userName/form";
import type { UserNameType, UserNameFormType } from "@entities/models/userName/types";
import type { CommentModel } from "@src/types/models/comment";

type Id = string;
type Extras = { comments: CommentModel[]; postComments: CommentModel[] };

export function createUserNameManager() {
    let manager: ReturnType<typeof createManager<UserNameType, UserNameFormType, Id, Extras>>;

    const listEntities = async () => {
        const editingId = manager.getState().editingId;
        if (!editingId) return { items: [] };
        const { data } = await userNameService.get({ id: editingId });
        return { items: data ? [data as UserNameType] : [] };
    };

    manager = createManager<UserNameType, UserNameFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialUserNameForm }),
        listEntities,
        getEntityById: async (id) => {
            const { data } = await userNameService.get({ id });
            return (data ?? null) as UserNameType | null;
        },
        createEntity: async (form) => {
            const { userId } = await getCurrentUser();
            const { data, errors } = await userNameService.create(
                toUserNameCreate({ ...form, id: userId })
            );
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await userNameService.update({
                id,
                ...toUserNameUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await userNameService.delete({ id });
        },
        loadExtras: async () => {
            const { data } = await commentService.list({ limit: 999 });
            const comments = (data ?? []).filter((c) => !c.postId);
            const postComments = (data ?? []).filter((c) => c.postId);
            return { comments, postComments };
        },
        loadEntityForm: async (id) => {
            const { data } = await userNameService.get({ id });
            if (!data) throw new Error("UserName not found");
            const { data: comments } = await commentService.list({ limit: 999 });
            const commentIds = (comments ?? [])
                .filter((c) => c.userNameId === id && !c.postId)
                .map((c) => c.id);
            const postCommentIds = (comments ?? [])
                .filter((c) => c.userNameId === id && c.postId)
                .map((c) => c.id);
            return toUserNameForm(data as UserNameType, commentIds, postCommentIds);
        },
        syncManyToMany: async (id, link, options) => {
            const relation = options?.relation ?? "comments";
            const { data } = await commentService.list({ limit: 999 });
            const current = (data ?? [])
                .filter(
                    (c) =>
                        c.userNameId === id && (relation === "postComments" ? c.postId : !c.postId)
                )
                .map((c) => c.id);
            const target = link.replace ?? [
                ...new Set([
                    ...current.filter((x) => !(link.remove ?? []).includes(x)),
                    ...(link.add ?? []),
                ]),
            ];
            await syncNN(
                current,
                target,
                (commentId) => commentService.update({ id: commentId, userNameId: id }),
                (commentId) => commentService.update({ id: commentId, userNameId: null })
            );
        },
    });
    return manager;
}

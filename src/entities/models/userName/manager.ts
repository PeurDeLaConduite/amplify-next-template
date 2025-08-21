// src/entities/models/userName/manager.ts
import { createManager } from "@entities/core";
import { userNameService } from "@entities/models/userName/service";
import { commentService } from "@entities/models/comment/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import { getUserSub } from "@entities/core/auth/getUserSub"; // <- assure-toi du bon chemin
import {
    initialUserNameForm,
    toUserNameForm,
    toUserNameCreate,
    toUserNameUpdate,
} from "@entities/models/userName/form";
import type { UserNameType, UserNameFormType } from "@entities/models/userName/types";
import type { CommentModel } from "@src/types/models/comment";
import { emitUserNameUpdated } from "@entities/models/userName/bus";

type Id = string;
type Extras = { comments: CommentModel[]; postComments: CommentModel[] };

// src/entities/models/userName/manager.ts
export function createUserNameManager() {
    return createManager<UserNameType, UserNameFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialUserNameForm }),

        listEntities: async ({ limit, nextToken }) => {
            const { data, nextToken: nt } = await userNameService.list({ limit, nextToken });
            return { items: (data ?? []) as UserNameType[], nextToken: nt };
        },

        // ✅ Respecte l'argument `id` et utilise la bonne forme { id }
        getEntityById: async (id) => {
            const { data } = await userNameService.get({ id });
            return (data ?? null) as UserNameType | null;
        },

        createEntity: async (form) => {
            const id = await getUserSub();
            const { data, errors } = await userNameService.create(
                toUserNameCreate({ ...form, id })
            );
            if (errors?.length) throw new Error(errors[0].message);
            emitUserNameUpdated(); // ✅ sans argument
            return data.id;
        },

        updateEntity: async (id, patch, { form }) => {
            const { data: existing } = await userNameService.get({ id });
            if (!existing) {
                const { errors } = await userNameService.create(toUserNameCreate({ ...form, id }));
                if (errors?.length) throw new Error(errors[0].message);
                emitUserNameUpdated(); // ✅
                return;
            }
            const { errors } = await userNameService.update({
                id,
                ...toUserNameUpdate({ ...form, ...patch }),
            });
            if (errors?.length) throw new Error(errors[0].message);
            emitUserNameUpdated(); // ✅
        },

        deleteById: async (id) => {
            await userNameService.delete({ id });
            emitUserNameUpdated();
        },

        loadExtras: async () => {
            const { data } = await commentService.list({ limit: 999 });
            const comments = (data ?? []).filter((c) => !c.postId);
            const postComments = (data ?? []).filter((c) => c.postId);
            return { comments, postComments };
        },

        // ✅ Corrigé : on lit { data }, on calcule *comments* localement, on teste data
        loadEntityForm: async (id) => {
            const { data } = await userNameService.get({ id });
            if (!data) throw new Error("UserName not found");

            const { data: allComments } = await commentService.list({ limit: 999 });
            const commentIds = (allComments ?? [])
                .filter((c) => c.userNameId === id && !c.postId)
                .map((c) => c.id);
            const postCommentIds = (allComments ?? [])
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
}

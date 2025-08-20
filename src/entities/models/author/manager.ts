import { createManager } from "@entities/core";
import { authorService } from "@entities/models/author/service";
import { postService } from "@entities/models/post/service";
import { syncManyToMany as syncNN } from "@entities/core/utils/syncManyToMany";
import {
    initialAuthorForm,
    toAuthorForm,
    toAuthorCreate,
    toAuthorUpdate,
} from "@entities/models/author/form";
import type { AuthorType, AuthorFormType } from "@entities/models/author/types";
import type { PostType, PostTypeUpdateInput } from "@entities/models/post/types";

type Id = string;
type Extras = { posts: PostType[] };

export function createAuthorManager() {
    return createManager<AuthorType, AuthorFormType, Id, Extras>({
        getInitialForm: () => ({ ...initialAuthorForm }),
        listEntities: async ({ limit }) => {
            const { data } = await authorService.list({ limit });
            return { items: (data ?? []) as AuthorType[] };
        },
        getEntityById: async (id) => {
            const { data } = await authorService.get({ id });
            return (data ?? null) as AuthorType | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await authorService.create(toAuthorCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await authorService.update({
                id,
                ...toAuthorUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await authorService.deleteCascade({ id });
        },
        loadExtras: async () => {
            const { data } = await postService.list({ limit: 999 });
            return { posts: data ?? [] };
        },
        loadEntityForm: async (id) => {
            const { data } = await authorService.get({ id });
            if (!data) throw new Error("Author not found");
            const { data: posts } = await postService.list({ limit: 999 });
            const postIds = (posts ?? []).filter((p) => p.authorId === id).map((p) => p.id);
            return toAuthorForm(data as AuthorType, postIds);
        },
        syncManyToMany: async (id, link) => {
            const { data } = await postService.list({ limit: 999 });
            const current = (data ?? []).filter((p) => p.authorId === id).map((p) => p.id);
            const target = link.replace ?? [
                ...new Set([
                    ...current.filter((x) => !(link.remove ?? []).includes(x)),
                    ...(link.add ?? []),
                ]),
            ];
            await syncNN(
                current,
                target,
                (postId) =>
                    postService.update({
                        id: postId,
                        authorId: id,
                    } as PostTypeUpdateInput & { id: string }),
                (postId) =>
                    postService.update({
                        id: postId,
                        authorId: null,
                    } as PostTypeUpdateInput & { id: string })
            );
        },
    });
}

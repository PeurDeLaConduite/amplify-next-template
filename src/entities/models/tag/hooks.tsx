import { useCallback, useEffect, useRef, useState } from "react";

import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { tagService } from "@entities/models/tag/service";
import { postTagService } from "@entities/relations/postTag/service";
import { type TagFormType, type TagType } from "@entities/models/tag/types";
import { type PostType } from "@entities/models/post/types";
import { type PostTagType } from "@entities/relations/postTag/types";
import { initialTagForm, toTagForm } from "@entities/models/tag/form";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

interface Extras {
    tags: TagType[];
    posts: PostType[];
    postTags: PostTagType[];
}

export function useTagForm() {
    const currentId = useRef<string | null>(null);
    const [loading, setLoading] = useState(true);

    const modelForm = useModelForm<TagFormType, Extras>({
        initialForm: initialTagForm,
        initialExtras: { tags: [], posts: [], postTags: [] },
        create: async (form) => {
            const { data } = await tagService.create({ name: form.name });
            if (!data) throw new Error("Erreur lors de la création du tag");
            return data.id;
        },
        update: async (form) => {
            if (!currentId.current) {
                throw new Error("ID du tag manquant pour la mise à jour");
            }
            const { data } = await tagService.update({
                id: currentId.current,
                name: form.name,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour du tag");
            return data.id;
        },
        syncRelations: async (id, form) => {
            const current = await postTagService.listByChild(id);
            await syncManyToMany(
                current,
                form.postIds,
                (postId) => postTagService.create(postId, id),
                (postId) => postTagService.delete(postId, id)
            );
        },
    });

    const { extras, setExtras, setForm, setMode, submit } = modelForm;

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const [t, p, pt] = await Promise.all([
            tagService.list(),
            postService.list(),
            postTagService.list(),
        ]);
        setExtras({
            tags: t.data ?? [],
            posts: p.data ?? [],
            postTags: pt.data ?? [],
        });
        setLoading(false);
    }, [setExtras]);

    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);

    const edit = useCallback(
        async (idx: number) => {
            const tag = extras.tags[idx];
            const postIds = await postTagService.listByChild(tag.id);
            currentId.current = tag.id;
            setForm(toTagForm(tag, postIds));
            setMode("edit");
        },
        [extras.tags, setForm, setMode]
    );

    const cancel = useCallback(() => {
        currentId.current = null;
        setForm(initialTagForm);
        setMode("create");
    }, [setForm, setMode]);

    const remove = useCallback(
        async (idx: number) => {
            const tag = extras.tags[idx];
            if (!window.confirm("Supprimer ce tag ?")) return;
            const linkedPosts = await postTagService.listByChild(tag.id);
            await Promise.all(linkedPosts.map((p) => postTagService.delete(p, tag.id)));
            await tagService.delete({ id: tag.id });
            await fetchAll();
        },
        [extras.tags, fetchAll]
    );

    const toggle = useCallback(
        async (postId: string, tagId: string) => {
            const exists = extras.postTags.some((pt) => pt.postId === postId && pt.tagId === tagId);
            if (exists) {
                await postTagService.delete(postId, tagId);
                setExtras((prev) => ({
                    ...prev,
                    postTags: prev.postTags.filter(
                        (pt) => !(pt.postId === postId && pt.tagId === tagId)
                    ),
                }));
            } else {
                await postTagService.create(postId, tagId);
                setExtras((prev) => ({
                    ...prev,
                    postTags: [...prev.postTags, { postId, tagId }],
                }));
            }
        },
        [extras.postTags, setExtras]
    );

    const tagsForPost = useCallback(
        (postId: string) => {
            const tagIds = extras.postTags
                .filter((pt) => pt.postId === postId)
                .map((pt) => pt.tagId);
            return extras.tags.filter((t) => tagIds.includes(t.id));
        },
        [extras.postTags, extras.tags]
    );

    const isTagLinked = useCallback(
        (postId: string, tagId: string) =>
            extras.postTags.some((pt) => pt.postId === postId && pt.tagId === tagId),
        [extras.postTags]
    );

    const save = useCallback(async () => {
        await submit();
        await fetchAll();
        cancel();
    }, [submit, fetchAll, cancel]);

    return {
        ...modelForm,
        loading,
        fetchAll,
        edit,
        cancel,
        save,
        remove,
        toggle,
        tagsForPost,
        isTagLinked,
    };
}

export type UseTagFormReturn = ReturnType<typeof useTagForm>;

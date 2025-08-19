import { useCallback, useEffect, useState } from "react";

import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { tagService } from "@entities/models/tag/service";
import { postTagService } from "@entities/relations/postTag/service";
import { type TagFormType, type TagType } from "@entities/models/tag/types";
import { type PostType } from "@entities/models/post/types";
import { initialTagForm, toTagForm } from "@entities/models/tag/form";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

// Pivot léger côté UI
type PostTagLink = { postId: string; tagId: string };

export interface TagFormExtras extends Record<string, unknown> {
    tags: TagType[];
    posts: PostType[];
    postTags: PostTagLink[]; // ⚠️ paires d'IDs uniquement côté UI
}

const initialExtras: TagFormExtras = {
    tags: [],
    posts: [],
    postTags: [],
};

export function useTagForm() {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const modelForm = useModelForm<TagFormType, TagFormExtras>({
        initialForm: initialTagForm,
        initialExtras,
        create: async (form) => {
            const { data } = await tagService.create({ name: form.name });
            if (!data) throw new Error("Erreur lors de la création du tag");
            setEditingId(data.id);
            return data.id;
        },
        update: async (form) => {
            if (!editingId) throw new Error("ID du tag manquant pour la mise à jour");
            const { data } = await tagService.update({ id: editingId, name: form.name });
            if (!data) throw new Error("Erreur lors de la mise à jour du tag");
            setEditingId(data.id);
            return data.id;
        },
        syncRelations: async (tagId, form) => {
            // 🔁 compare des IDs (postIds actuels vs désirés)
            const currentPostIds = await postTagService.listByChild(tagId); // idéal: string[]
            // Si ton service renvoie des objets, décommente la normalisation :
            // const currentPostIds = (await postTagService.listByChild(tagId)).map(x => x.postId);

            await syncManyToMany(
                currentPostIds,
                form.postIds,
                (postId) => postTagService.create(postId, tagId),
                (postId) => postTagService.delete(postId, tagId)
            );
        },
    });

    const { extras, setExtras, setForm, setMode, submit, reset: formReset } = modelForm;

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const [t, p, pt] = await Promise.all([
                tagService.list(),
                postService.list(),
                postTagService.list(), // renvoie PostTagType[]
            ]);

            // ✅ Normalise les pivots en paires d’IDs pour l’UI
            setExtras((prev) => ({
                ...prev,
                tags: t.data ?? [],
                posts: p.data ?? [],
                postTags: (pt.data ?? []).map(({ postId, tagId }) => ({ postId, tagId })),
            }));
        } finally {
            setLoading(false);
        }
    }, [setExtras]);

    useEffect(() => {
        void fetchAll();
    }, [fetchAll]);

    const selectById = useCallback(
        async (id: string) => {
            const tag = extras.tags.find((t) => t.id === id);
            if (!tag) return;
            const postIds = await postTagService.listByChild(tag.id);
            setForm(toTagForm(tag, postIds));
            setMode("edit");
            setEditingId(tag.id);
        },
        [extras.tags, setForm, setMode]
    );

    const reset = useCallback(() => {
        setEditingId(null);
        formReset();
    }, [formReset]);

    const removeById = useCallback(
        async (id: string) => {
            const tag = extras.tags.find((t) => t.id === id);
            if (!tag) return;
            if (!window.confirm("Supprimer ce tag ?")) return;
            await tagService.deleteCascade({ id: tag.id });
            await fetchAll();
            if (editingId === id) {
                reset();
            }
        },
        [extras.tags, fetchAll, editingId, reset]
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

    // Sélecteurs utilitaires
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

    return {
        ...modelForm,
        reset,
        cancel: reset,
        loading,
        fetchAll,
        selectById,
        removeById,
        toggle,
        tagsForPost,
        isTagLinked,
        editingId,
    };
}

export type UseTagFormReturn = ReturnType<typeof useTagForm>;

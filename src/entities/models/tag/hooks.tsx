import { useCallback, useEffect, useRef, useState } from "react";

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
    index: number | null; // purement UI, optionnel
    tags: TagType[];
    posts: PostType[];
    postTags: PostTagLink[]; // ⚠️ paires d'IDs uniquement côté UI
}

const initialExtras: TagFormExtras = {
    index: null,
    tags: [],
    posts: [],
    postTags: [],
};

export function useTagForm() {
    const currentId = useRef<string | null>(null);
    const [loading, setLoading] = useState(true);

    const modelForm = useModelForm<TagFormType, TagFormExtras>({
        initialForm: initialTagForm,
        initialExtras,
        create: async (form) => {
            const { data } = await tagService.create({ name: form.name });
            if (!data) throw new Error("Erreur lors de la création du tag");
            return data.id;
        },
        update: async (form) => {
            if (!currentId.current) throw new Error("ID du tag manquant pour la mise à jour");
            const { data } = await tagService.update({ id: currentId.current, name: form.name });
            if (!data) throw new Error("Erreur lors de la mise à jour du tag");
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

    const { extras, setExtras, setForm, setMode, submit } = modelForm;

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

    const edit = useCallback(
        async (idx: number) => {
            const tag = extras.tags[idx];
            if (!tag) return;
            const postIds = await postTagService.listByChild(tag.id); // idéal: string[]
            // Si objets -> normalise : const postIds = (await postTagService.listByChild(tag.id)).map(x => x.postId);
            currentId.current = tag.id;
            setForm(toTagForm(tag, postIds));
            setMode("edit");
            setExtras((prev) => ({ ...prev, index: idx }));
        },
        [extras.tags, setForm, setMode, setExtras]
    );

    const cancel = useCallback(() => {
        currentId.current = null;
        setForm(initialTagForm);
        setMode("create");
        setExtras((prev) => ({ ...prev, index: null }));
    }, [setForm, setMode, setExtras]);

    const remove = useCallback(
        async (idx: number) => {
            const tag = extras.tags[idx];
            if (!tag) return;
            if (!window.confirm("Supprimer ce tag ?")) return;
            const linkedPostIds = await postTagService.listByChild(tag.id);
            // Si objets -> normalise : const linkedPostIds = (await postTagService.listByChild(tag.id)).map(x => x.postId);
            await Promise.all(linkedPostIds.map((postId) => postTagService.delete(postId, tag.id)));
            await tagService.delete({ id: tag.id });
            await fetchAll();
            if (extras.index === idx) {
                cancel();
            }
        },
        [extras.tags, extras.index, fetchAll, cancel]
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

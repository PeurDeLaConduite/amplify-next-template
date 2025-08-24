// src/entities/models/tag/hooks.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { tagService } from "@entities/models/tag/service";
import { postTagService } from "@entities/relations/postTag/service";
import { type TagFormType, type TagType } from "@entities/models/tag/types";
import { type PostType } from "@entities/models/post/types";
import { initialTagForm, toTagForm } from "@entities/models/tag/form";
import { syncTagToPosts } from "@entities/relations/postTag/sync";
import { toggleId, normalizeTagName } from "@entities/core/utils";

// Pivot léger côté UI
type PostTagLink = { postId: string; tagId: string };

export interface TagFormExtras extends Record<string, unknown> {
    tags: TagType[];
    posts: PostType[];
    postTags: PostTagLink[];
}

const initialExtras: TagFormExtras = { tags: [], posts: [], postTags: [] };

export function useTagForm(tag: TagType | null) {
    const [tagId, setTagId] = useState<string | null>(tag?.id ?? null);
    const [loading, setLoading] = useState(true);

    // ⚠️ utilisé par validate() pour toujours lire la dernière liste de tags
    const extrasRef = useRef<TagFormExtras>(initialExtras);

    const modelForm = useModelForm<TagFormType, TagFormExtras>({
        initialForm: initialTagForm,
        initialExtras,

        // ✅ Validation bloquante (retourne false en cas d'erreur)
        validate: (form) => {
            const name = (form.name ?? "").trim();
            if (!name) {
                alert("Le nom du tag est requis.");
                return false;
            }

            const norm = normalizeTagName(name);
            const currentId = tagId; // string | null

            // On considère doublon si un autre tag (id différent) a le même nom normalisé
            const exists = (extrasRef.current.tags ?? []).some(
                (t) => normalizeTagName(t.name) === norm && (currentId ? t.id !== currentId : true)
            );

            if (exists) {
                alert("Ce tag existe déjà.");
                return false;
            }
            return true;
        },

        // ✅ Créer avec re-check de sécurité (au cas où quelqu'un contourne validate)
        create: async (form) => {
            const name = (form.name ?? "").trim();
            const norm = normalizeTagName(name);
            const dup = (extrasRef.current.tags ?? []).some(
                (t) => normalizeTagName(t.name) === norm
            );
            if (dup) {
                throw new Error("Ce tag existe déjà.");
            }

            const { data } = await tagService.create({ name });
            if (!data) throw new Error("Erreur lors de la création du tag");
            setTagId(data.id);
            setMessage("Nouveau tag créé avec succès.");

            // rafraîchir la liste en local pour que le prochain validate voie ce nouveau tag
            await listTags();

            return data.id;
        },

        // ✅ Mettre à jour avec re-check
        update: async (form) => {
            if (!tagId) throw new Error("ID du tag manquant pour la mise à jour");

            const name = (form.name ?? "").trim();
            const norm = normalizeTagName(name);
            const dup = (extrasRef.current.tags ?? []).some(
                (t) => t.id !== tagId && normalizeTagName(t.name) === norm
            );
            if (dup) {
                throw new Error("Ce tag existe déjà.");
            }

            const { data } = await tagService.update({ id: tagId, name });
            if (!data) throw new Error("Erreur lors de la mise à jour du tag");
            setTagId(data.id);
            setMessage("Tag mis à jour avec succès.");

            await listTags();

            return data.id;
        },

        // ✅ Sync relationnelle (tags ↔ posts)
        syncRelations: async (id, form) => {
            await syncTagToPosts(id, form.postIds);
        },
    });

    const { extras, setExtras, setForm, setMode, refresh, setMessage, setError } = modelForm;

    // 🔄 Garder extrasRef en phase avec extras (clé pour la validation anti-doublon)
    useEffect(() => {
        extrasRef.current = extras;
    }, [extras]);

    // Liste tags + posts + pivots normalisés
    const listTags = useCallback(async () => {
        setLoading(true);
        try {
            const [t, p, pt] = await Promise.all([
                tagService.list(),
                postService.list(),
                postTagService.list(),
            ]);
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
        void listTags();
    }, [listTags]);

    // Hydrate le form selon tag courant (édition vs création)
    useEffect(() => {
        void (async () => {
            if (tag) {
                const postIds = await postTagService.listByParent(tag.id);
                setForm(toTagForm(tag, postIds));
                setMode("edit");
                setTagId(tag.id);
            } else {
                setForm(initialTagForm);
                setMode("create");
                setTagId(null);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tag, setForm, setMode]);

    // Sélection par ID (comme les autres hooks)
    const selectById = useCallback(
        (id: string) => {
            const tagItem = extras.tags.find((t) => t.id === id) ?? null;
            if (tagItem) {
                setTagId(id);
                void (async () => {
                    const postIds = await postTagService.listByParent(id);
                    setForm(toTagForm(tagItem, postIds));
                    setMode("edit");
                })();
            }
            return tagItem;
        },
        [extras.tags, setForm, setMode]
    );

    // Suppression en cascade + messages + refresh
    const deleteEntity = useCallback(
        async (id: string) => {
            if (!window.confirm("Supprimer ce tag ?")) return;
            try {
                setMessage("Suppression des données relationnelles...");
                await tagService.deleteCascade({ id });
                await listTags();
                if (tagId === id) setTagId(null);
                setMessage("Tag supprimé avec succès.");
                refresh();
            } catch (e: unknown) {
                setError(e);
                setMessage("Erreur lors de la suppression du tag.");
            }
        },
        [listTags, tagId, refresh, setError, setMessage]
    );

    // ✅ toggle pour l’édition du tag courant (modifie form.postIds)
    const togglePost = useCallback(
        (postId: string) => {
            setForm((prev) => ({
                ...prev,
                postIds: toggleId(prev.postIds ?? [], postId),
            }));
        },
        [setForm]
    );

    return {
        ...modelForm,
        loading,
        tagId,
        listTags,
        selectById,
        deleteEntity,
        togglePost, 
    };
}

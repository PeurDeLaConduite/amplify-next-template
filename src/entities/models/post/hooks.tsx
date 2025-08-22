// src/entities/models/post/hooks.tsx
import { useEffect, useCallback, useState } from "react";
import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { authorService } from "@entities/models/author/service";
import { tagService } from "@entities/models/tag/service";
import { sectionService } from "@entities/models/section/service";
import { initialPostForm, toPostForm } from "@entities/models/post/form";
import { type PostFormType, type PostType } from "@entities/models/post/types";
import { type AuthorType } from "@entities/models/author/types";
import { type TagType } from "@entities/models/tag/types";
import { type SectionType } from "@entities/models/section/types";
import { syncPost2Tags } from "@entities/relations/postTag";
import { syncPost2Sections } from "@entities/relations/sectionPost";
import { unknown } from "zod";
interface Extras extends Record<string, unknown> {
    authors: AuthorType[];
    tags: TagType[];
    sections: SectionType[];
    posts: PostType[];
}

export function usePostForm(post: PostType | null) {
    const [editingId, setEditingId] = useState<string | null>(post?.id ?? null);

    const modelForm = useModelForm<PostFormType, Extras>({
        initialForm: initialPostForm,
        initialExtras: { authors: [], tags: [], sections: [], posts: [] },

        validate: (form) => {
            if (!form.authorId) {
                alert("Veuillez sélectionner un auteur.");
                return false;
            }
            return true;
        },

        create: async (form) => {
            const { tagIds, sectionIds, ...postInput } = form;
            void tagIds;
            void sectionIds;
            const { data } = await postService.create({
                ...postInput,
                seo: form.seo,
            });
            if (!data) throw new Error("Erreur lors de la création de l'article");
            setEditingId(data.id);
            setMessage("Nouvel article créé avec succès.");
            return data.id;
        },
        update: async (form) => {
            if (!editingId) {
                throw new Error("ID du post manquant pour la mise à jour");
            }
            const { tagIds, sectionIds, ...postInput } = form;
            void tagIds;
            void sectionIds;
            const { data } = await postService.update({
                id: editingId,
                ...postInput,
                seo: form.seo,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'article");
            setEditingId(data.id);
            setMessage("Article mis à jour avec succès.");

            return data.id;
        },
        syncRelations: async (id, form) => {
            await Promise.all([
                syncPost2Tags(id, form.tagIds),
                syncPost2Sections(id, form.sectionIds),
            ]);
        },
    });

    const { setForm, setExtras, setMode, extras, refresh, setMessage, setError } = modelForm;

    const fetchPosts = useCallback(async () => {
        const { data } = await postService.list();
        setExtras((e) => ({ ...e, posts: data ?? [] }));
    }, [setExtras]);

    useEffect(() => {
        void (async () => {
            const [a, t, s] = await Promise.all([
                authorService.list(),
                tagService.list(),
                sectionService.list(),
            ]);
            setExtras((e) => ({
                ...e,
                authors: a.data ?? [],
                tags: t.data ?? [],
                sections: s.data ?? [],
            }));
        })();
        void fetchPosts();
    }, [setExtras, fetchPosts]);

    useEffect(() => {
        void (async () => {
            if (post) {
                const [tagIds, sectionIds] = await Promise.all([
                    postTagService.listByParent(post.id),
                    sectionPostService.listByChild(post.id),
                ]);
                setForm(toPostForm(post, tagIds, sectionIds));
                setMode("edit");
                setEditingId(post.id);
            } else {
                setForm(initialPostForm);
                setMode("create");
                setEditingId(null);
            }
        })();
    }, [post, setForm, setMode]);

    function toggleTag(tagId: string) {
        setForm((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    }

    function toggleSection(sectionId: string) {
        setForm((prev) => ({
            ...prev,
            sectionIds: prev.sectionIds.includes(sectionId)
                ? prev.sectionIds.filter((id) => id !== sectionId)
                : [...prev.sectionIds, sectionId],
        }));
    }

    const selectById = useCallback(
        (id: string) => {
            const postItem = extras.posts.find((p) => p.id === id) ?? null;
            if (postItem) {
                setEditingId(id);
                void (async () => {
                    const [tagIds, sectionIds] = await Promise.all([
                        postTagService.listByParent(id),
                        sectionPostService.listByChild(id),
                    ]);
                    setForm(toPostForm(postItem, tagIds, sectionIds));
                    setMode("edit");
                })();
            }
            return postItem;
        },
        [extras.posts, setForm, setMode]
    );

    const removeById = useCallback(
        async (id: string) => {
            if (!window.confirm("Supprimer cet article ?")) return;

            try {
                setMessage("Suppression des données relationnelles...");
                await postService.deleteCascade({ id });
                await fetchPosts();

                if (editingId === id) {
                    setEditingId(null);
                }

                setMessage("Article supprimé avec succès.");
                refresh();
            } catch (e: unknown) {
                setError(e); // si setError est dispo dans ton hook
                setMessage("Erreur lors de la suppression de l’article.");
                // pas de throw: l’UI affiche le message d’erreur
            }
        },
        [fetchPosts, editingId, refresh]
    );

    return {
        ...modelForm,
        editingId,
        fetchPosts,
        selectById,
        removeById,
        toggleTag,
        toggleSection,
    };
}

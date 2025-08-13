// src/entities/models/post/hooks.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityFormManager } from "@entities/core/hooks";
import { postService as makePostService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { authorService as makeAuthorService } from "@entities/models/author/service";
import { tagService as makeTagService } from "@entities/models/tag/service";
import { sectionService as makeSectionService } from "@entities/models/section/service";
import { initialPostForm, toPostForm } from "@entities/models/post/form";
import { type PostFormType, type PostType } from "@entities/models/post/types";
import { type AuthorType } from "@entities/models/author/types";
import { type TagType } from "@entities/models/tag/types";
import { type SectionTypes } from "@entities/models/section/types";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import type { AuthUser } from "@entities/core/types";
import { extractGroups } from "@entities/core/auth"; // util sans any

interface Extras extends Record<string, unknown> {
    authors: AuthorType[];
    tags: TagType[];
    sections: SectionTypes[];
}

export function usePostForm(post: PostType | null) {
    const { user } = useAuthenticator();

    // Map Amplify user -> AuthUser (username + groups)
    const authUser = useMemo<AuthUser | null>(() => {
        if (!user) return null;
        const username =
            (user as unknown as { userId?: string })?.userId ??
            (user as unknown as { username?: string })?.username ??
            undefined;
        return { username, groups: extractGroups(user) };
    }, [user]);

    // Instancie TOUS les services via la factory (crudService)
    const postSvc = useMemo(() => makePostService(authUser), [authUser]);
    const authorSvc = useMemo(() => makeAuthorService(authUser), [authUser]);
    const tagSvc = useMemo(() => makeTagService(authUser), [authUser]);
    const sectionSvc = useMemo(() => makeSectionService(authUser), [authUser]);

    const modelForm = useEntityFormManager<PostFormType, Extras>({
        initialForm: initialPostForm,
        initialExtras: { authors: [], tags: [], sections: [] },

        // CREATE via crudService
        create: async (form) => {
            const { tagIds, sectionIds, ...postInput } = form;
            void tagIds;
            void sectionIds;
            const { data } = await postSvc.create({
                ...postInput,
                seo: form.seo,
            });
            if (!data) throw new Error("Erreur lors de la création de l'article");
            return data.id;
        },

        // UPDATE via crudService (id requis)
        update: async (form) => {
            if (!post?.id) throw new Error("ID du post manquant pour la mise à jour");
            const { tagIds, sectionIds, ...postInput } = form;
            void tagIds;
            void sectionIds;
            const { data } = await postSvc.update({
                id: post.id,
                ...postInput,
                seo: form.seo,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'article");
            return data.id;
        },

        // Relations M:N via services pivot (inchangé)
        syncRelations: async (id, form) => {
            const [currentTagIds, currentSectionIds] = await Promise.all([
                postTagService.listByParent(id),
                sectionPostService.listByChild(id),
            ]);
            await Promise.all([
                syncManyToMany(
                    currentTagIds,
                    form.tagIds,
                    (tagId) => postTagService.create(id, tagId),
                    (tagId) => postTagService.delete(id, tagId)
                ),
                syncManyToMany(
                    currentSectionIds,
                    form.sectionIds,
                    (sectionId) => sectionPostService.create(sectionId, id),
                    (sectionId) => sectionPostService.delete(sectionId, id)
                ),
            ]);
        },
    });

    const { setForm, setExtras, startEdit, startCreate } = modelForm;

    // Charger les listes (READ via crudService)
    useEffect(() => {
        void (async () => {
            const [a, t, s] = await Promise.all([
                authorSvc.list(),
                tagSvc.list(),
                sectionSvc.list(),
            ]);
            setExtras({
                authors: a.data ?? [],
                tags: t.data ?? [],
                sections: s.data ?? [],
            });
        })();
    }, [authorSvc, tagSvc, sectionSvc, setExtras]);

    // Init form selon post courant
    useEffect(() => {
        void (async () => {
            if (post) {
                const [tagIds, sectionIds] = await Promise.all([
                    postTagService.listByParent(post.id),
                    sectionPostService.listByChild(post.id),
                ]);
                startEdit(toPostForm(post, tagIds, sectionIds));
            } else {
                startCreate();
            }
        })();
    }, [post, startEdit, startCreate]);

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

    return { ...modelForm, toggleTag, toggleSection };
}

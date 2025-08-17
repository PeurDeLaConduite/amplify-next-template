// src/entities/models/post/hooks.tsx
import { useEffect } from "react";
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
import { type SectionTypes } from "@entities/models/section/types";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

interface Extras extends Record<string, unknown> {
    authors: AuthorType[];
    tags: TagType[];
    sections: SectionTypes[];
}

export function usePostForm(post: PostType | null) {
    const modelForm = useModelForm<PostFormType, Extras>({
        initialForm: initialPostForm,
        initialExtras: { authors: [], tags: [], sections: [] },
        create: async (form) => {
            const { tagIds, sectionIds, ...postInput } = form;
            void tagIds;
            void sectionIds;
            const { data } = await postService.create({
                ...postInput,
                seo: form.seo,
            });
            if (!data) throw new Error("Erreur lors de la création de l'article");
            return data.id;
        },
        update: async (form) => {
            if (!post?.id) {
                throw new Error("ID du post manquant pour la mise à jour");
            }
            const { tagIds, sectionIds, ...postInput } = form;
            void tagIds;
            void sectionIds;
            const { data } = await postService.update({
                id: post.id,
                ...postInput,
                seo: form.seo,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'article");
            return data.id;
        },
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

    const { setForm, setExtras, setMode } = modelForm;

    useEffect(() => {
        void (async () => {
            const [a, t, s] = await Promise.all([
                authorService.list(),
                tagService.list(),
                sectionService.list(),
            ]);
            setExtras({
                authors: a.data ?? [],
                tags: t.data ?? [],
                sections: s.data ?? [],
            });
        })();
    }, [setExtras]);

    useEffect(() => {
        void (async () => {
            if (post) {
                const [tagIds, sectionIds] = await Promise.all([
                    postTagService.listByParent(post.id),
                    sectionPostService.listByChild(post.id),
                ]);
                setForm(toPostForm(post, tagIds, sectionIds));
                setMode("edit");
            } else {
                setForm(initialPostForm);
                setMode("create");
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

    return { ...modelForm, toggleTag, toggleSection };
}

import { useCallback, useEffect, useState } from "react";
import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { sectionService } from "@entities/models/section/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { initialSectionForm, toSectionForm } from "@entities/models/section/form";
import { type SectionFormTypes, type SectionTypes } from "@entities/models/section/types";
import { type PostType } from "@entities/models/post/types";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

type Extras = { posts: PostType[]; sections: SectionTypes[] };

export function useSectionForm(section: SectionTypes | null) {
    const [editingId, setEditingId] = useState<string | null>(section?.id ?? null);

    const modelForm = useModelForm<SectionFormTypes, Extras>({
        initialForm: initialSectionForm,
        initialExtras: { posts: [], sections: [] },
        create: async (form) => {
            const { postIds, ...sectionInput } = form;
            void postIds;
            const { data } = await sectionService.create(sectionInput);
            if (!data) throw new Error("Erreur lors de la création de la section");
            setEditingId(data.id);
            return data.id;
        },
        update: async (form) => {
            if (!editingId) {
                throw new Error("ID de la section manquant pour la mise à jour");
            }
            const { postIds, ...sectionInput } = form;
            void postIds;
            const { data } = await sectionService.update({
                id: editingId,
                ...sectionInput,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de la section");
            setEditingId(data.id);
            return data.id;
        },
        syncRelations: async (id, form) => {
            const [currentPostIds] = await Promise.all([sectionPostService.listByParent(id)]);
            await Promise.all([
                syncManyToMany(
                    currentPostIds,
                    form.postIds,
                    (postId) => sectionPostService.create(id, postId),
                    (postId) => sectionPostService.delete(id, postId)
                ),
            ]);
        },
    });

    const { extras, setForm, setExtras, setMode, reset } = modelForm;

    const fetchList = useCallback(async () => {
        const { data } = await sectionService.list();
        setExtras((e) => ({ ...e, sections: data ?? [] }));
    }, [setExtras]);

    useEffect(() => {
        void (async () => {
            const { data } = await postService.list();
            setExtras((e) => ({ ...e, posts: data ?? [] }));
        })();
        void fetchList();
    }, [setExtras, fetchList]);

    useEffect(() => {
        void (async () => {
            if (section) {
                const postIds = await sectionPostService.listByParent(section.id);
                setForm(toSectionForm(section, postIds));
                setMode("edit");
                setEditingId(section.id);
            } else {
                setForm(initialSectionForm);
                setMode("create");
                setEditingId(null);
            }
        })();
    }, [section, setForm, setMode]);

    const selectById = useCallback(
        (id: string) => {
            const sectionItem = extras.sections.find((s) => s.id === id) ?? null;
            if (sectionItem) {
                setEditingId(id);
                void (async () => {
                    const postIds = await sectionPostService.listByParent(id);
                    setForm(toSectionForm(sectionItem, postIds));
                    setMode("edit");
                })();
            }
            return sectionItem;
        },
        [extras.sections, setForm, setMode]
    );

    const removeById = useCallback(
        async (id: string) => {
            const sectionItem = selectById(id);
            if (!sectionItem) return;
            if (!window.confirm("Supprimer cette section ?")) return;
            await sectionService.deleteCascade({ id: sectionItem.id });
            await fetchList();
            if (editingId === id) {
                setEditingId(null);
                reset();
            }
        },
        [selectById, fetchList, editingId, reset]
    );

    return { ...modelForm, editingId, fetchList, selectById, removeById };
}

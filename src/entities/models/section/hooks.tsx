import { useCallback, useEffect } from "react";
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
    const modelForm = useModelForm<SectionFormTypes, Extras>({
        initialForm: initialSectionForm,
        initialExtras: { posts: [], sections: [] },
        create: async (form) => {
            const { postIds, ...sectionInput } = form;
            void postIds;
            const { data } = await sectionService.create(sectionInput);
            if (!data) throw new Error("Erreur lors de la création de la section");
            return data.id;
        },
        update: async (form) => {
            if (!section?.id) {
                throw new Error("ID de la section manquant pour la mise à jour");
            }
            const { postIds, ...sectionInput } = form;
            void postIds;
            const { data } = await sectionService.update({
                id: section.id,
                ...sectionInput,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de la section");
            return data.id;
        },
        syncRelations: async (id, form) => {
            const currentPostIds = await sectionPostService.listByParent(id);
            await syncManyToMany(
                currentPostIds,
                form.postIds,
                (postId) => sectionPostService.create(id, postId),
                (postId) => sectionPostService.delete(id, postId)
            );
        },
    });

    const { extras, setForm, setExtras, setMode } = modelForm;

    const fetchList = useCallback(async () => {
        const { data } = await sectionService.list();
        setExtras((e) => ({ ...e, sections: data ?? [] }));
    }, [setExtras]);

    const remove = useCallback(
        async (idx: number) => {
            const sectionItem = extras.sections[idx];
            if (!sectionItem) return;
            if (!window.confirm("Supprimer cette section ?")) return;
            await sectionService.deleteCascade({ id: sectionItem.id });
            await fetchList();
        },
        [extras.sections, fetchList]
    );

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
            } else {
                setForm(initialSectionForm);
                setMode("create");
            }
        })();
    }, [section, setForm, setMode]);

    return { ...modelForm, fetchList, remove };
}

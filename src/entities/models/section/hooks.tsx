import { useCallback, useEffect, useState } from "react";
import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { sectionService } from "@entities/models/section/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { initialSectionForm, toSectionForm } from "@entities/models/section/form";
import { type SectionFormTypes, type SectionType } from "@entities/models/section/types";
import { type PostType } from "@entities/models/post/types";
import { syncSection2Posts } from "@entities/relations/sectionPost";

type Extras = { posts: PostType[]; sections: SectionType[] };

export function useSectionForm(section: SectionType | null) {
    const [sectionId, setSectionId] = useState<string | null>(section?.id ?? null);

    const modelForm = useModelForm<SectionFormTypes, Extras>({
        initialForm: initialSectionForm,
        initialExtras: { posts: [], sections: [] },
        create: async (form) => {
            const { postIds, ...sectionInput } = form;
            void postIds;
            const { data } = await sectionService.create(sectionInput);
            if (!data) throw new Error("Erreur lors de la création de la section");
            setSectionId(data.id);
            return data.id;
        },
        update: async (form) => {
            if (!sectionId) {
                throw new Error("ID de la section manquant pour la mise à jour");
            }
            const { postIds, ...sectionInput } = form;
            void postIds;
            const { data } = await sectionService.update({
                id: sectionId,
                ...sectionInput,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de la section");
            setSectionId(data.id);
            return data.id;
        },
        syncRelations: async (id, form) => {
            // 🔗 Section ↔ Post (via createM2MSync)
            await syncSection2Posts(id, form.postIds);
        },
    });

    const { extras, setForm, setExtras, setMode, reset } = modelForm;

    const listSections = useCallback(async () => {
        const { data } = await sectionService.list();
        setExtras((e) => ({ ...e, sections: data ?? [] }));
    }, [setExtras]);

    useEffect(() => {
        void (async () => {
            const { data } = await postService.list();
            setExtras((e) => ({ ...e, posts: data ?? [] }));
        })();
        void listSections();
    }, [setExtras, listSections]);

    useEffect(() => {
        void (async () => {
            if (section) {
                const postIds = await sectionPostService.listByParent(section.id);
                setForm(toSectionForm(section, postIds));
                setMode("edit");
                setSectionId(section.id);
            } else {
                setForm(initialSectionForm);
                setMode("create");
                setSectionId(null);
            }
        })();
    }, [section, setForm, setMode]);

    const selectById = useCallback(
        (id: string) => {
            const sectionItem = extras.sections.find((s) => s.id === id) ?? null;
            if (sectionItem) {
                setSectionId(id);
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
            await listSections();
            if (sectionId === id) {
                setSectionId(null);
                reset();
            }
        },
        [selectById, listSections, sectionId, reset]
    );

    return { ...modelForm, sectionId, listSections, selectById, removeById };
}

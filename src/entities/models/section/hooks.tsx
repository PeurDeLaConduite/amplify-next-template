import { useEffect, type ChangeEvent } from "react";
import { useModelForm } from "@entities/core/hooks";
import { postService } from "@entities/models/post/service";
import { sectionService } from "@entities/models/section/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import { initialSectionForm, toSectionForm } from "@entities/models/section/form";
import { type SectionFormTypes, type SectionTypes } from "@entities/models/section/types";
import { type PostType } from "@entities/models/post/types";
import { useAutoGenFields, slugify } from "@hooks/useAutoGenFields";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";

type Extras = { posts: PostType[] };

export function useSectionForm(section: SectionTypes | null, onSave: () => void) {
    const modelForm = useModelForm<SectionFormTypes, Extras>({
        initialForm: initialSectionForm,
        initialExtras: { posts: [] },
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

    const { form, extras, setForm, setExtras, setMode, submit, saving } = modelForm;

    const { handleSourceFocus, handleSourceBlur, handleManualEdit } = useAutoGenFields({
        configs: [
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.slug ?? "",
                target: "slug",
                setter: (v) => setForm((f) => ({ ...f, slug: v ?? "" })),
                transform: slugify,
            },
            {
                editingKey: "title",
                source: form.title ?? "",
                current: form.seo.title ?? "",
                target: "seo.title",
                setter: (v) =>
                    setForm((f) => ({
                        ...f,
                        seo: { ...f.seo, title: v ?? "" },
                    })),
            },
            {
                editingKey: "description",
                source: form.description ?? "",
                current: form.seo.description ?? "",
                target: "seo.description",
                setter: (v) =>
                    setForm((f) => ({
                        ...f,
                        seo: { ...f.seo, description: v ?? "" },
                    })),
            },
        ],
    });

    useEffect(() => {
        void (async () => {
            const { data } = await postService.list();
            setExtras({ posts: data ?? [] });
        })();
    }, [setExtras]);

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

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1] as keyof SectionFormTypes["seo"];
            setForm((f) => ({ ...f, seo: { ...f.seo, [key]: value } }));
            handleManualEdit(`seo.${key}`);
        } else if (name === "slug") {
            setForm((f) => ({ ...f, slug: slugify(value) }));
            handleManualEdit("slug");
        } else {
            setForm((f) => ({ ...f, [name]: value }));
            if (name === "slug") handleManualEdit("slug");
        }
    }

    async function handleSubmit() {
        await submit();
        setMode("create");
        setForm(initialSectionForm);
        onSave();
    }

    return {
        form,
        posts: extras.posts,
        saving,
        handleChange,
        handleSubmit,
        handleTitleFocus: handleSourceFocus,
        handleTitleBlur: handleSourceBlur,
        setForm,
    };
}

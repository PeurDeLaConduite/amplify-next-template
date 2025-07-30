import { useState, useEffect, ChangeEvent } from "react";
import type { SectionForm, Section, Post } from "@/src/types";
import { client, sectionPostService } from "@/src/services";
import { useAutoGenFields, slugify } from "@/src/hooks/useAutoGenFields";

export function useSectionForm(section: Section | null, onSave: () => void) {
    const initialForm: SectionForm = {
        slug: "",
        title: "",
        description: "",
        order: 1,
        seo: { title: "", description: "", image: "" },
        postIds: [],
    };

    const [form, setForm] = useState<SectionForm>(initialForm);
    const [posts, setPosts] = useState<Post[]>([]);
    const [saving, setSaving] = useState(false);

    // HOOK d'auto-génération : slug & seo.title depuis title, seo.description depuis description
    const { handleSourceFocus, handleSourceBlur, handleManualEdit } = useAutoGenFields({
        configs: [
            {
                editingKey: "title",
                source: form.title ?? "",
                target: "slug",
                setter: (v) => setForm((f) => ({ ...f, slug: v ?? "" })),
                transform: slugify,
            },
            {
                editingKey: "title",
                source: form.title ?? "",
                target: "seo.title",
                setter: (v) => setForm((f) => ({ ...f, seo: { ...f.seo, title: v ?? "" } })),
            },
            {
                editingKey: "description",
                source: form.description ?? "",
                target: "seo.description",
                setter: (v) => setForm((f) => ({ ...f, seo: { ...f.seo, description: v ?? "" } })),
            },
        ],
    });

    useEffect(() => {
        loadPosts();
        if (section) loadSection(section);
        else setForm(initialForm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [section]);

    async function loadPosts() {
        const { data } = await client.models.Post.list();
        setPosts(data ?? []);
    }

    async function loadSection(section: Section) {
        const postIds = await sectionPostService.listByParent(section.id);
        setForm({
            slug: section.slug ?? "",
            title: section.title ?? "",
            description: section.description ?? "",
            order: section.order ?? 1,
            seo: {
                title: section.seo?.title ?? "",
                description: section.seo?.description ?? "",
                image: section.seo?.image ?? "",
            },
            postIds,
        });
        // Ici tu pourrais aussi remettre à true tous les autoFlags si tu veux "réinitialiser" l'autogen à chaque changement de section.
    }

    function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1];
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

    const handleSubmit = async () => {
        setSaving(true);
        if (!form.title) {
            alert("Le titre est obligatoire !");
            setSaving(false);
            return;
        }

        const { postIds, ...sectionInput } = form;
        void postIds;
        const isUpdate = Boolean(section?.id);

        try {
            const result = isUpdate
                ? await client.models.Section.update({ id: section!.id, ...sectionInput })
                : await client.models.Section.create(sectionInput);

            if (!result.data) {
                throw new Error(
                    result.errors?.map((e) => e.message).join(", ") || "Aucune donnée retournée"
                );
            }

            const sectionId = result.data.id;
            await syncRelations(sectionId);
            setForm(initialForm);
            onSave();
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            alert(`Erreur lors de la sauvegarde : ${message}`);
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    async function syncRelations(sectionId: string) {
        const currentPostIds = await sectionPostService.listByParent(sectionId);
        const idsToAdd = form.postIds.filter((id) => !currentPostIds.includes(id));
        const idsToRemove = currentPostIds.filter((id) => !form.postIds.includes(id));
        await Promise.all([
            ...idsToAdd.map((postId) => sectionPostService.create(sectionId, postId)),
            ...idsToRemove.map((postId) => sectionPostService.delete(sectionId, postId)),
        ]);
    }

    return {
        form,
        posts,
        saving,
        handleChange,
        handleSubmit,
        handleTitleFocus: (key: string) => handleSourceFocus(key),
        handleTitleBlur: (key: string) => handleSourceBlur(key),
        setForm,
    };
}

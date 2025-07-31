import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { crudService, postTagService, sectionPostService } from "@/src/services";
import { useAutoGenFields, slugify } from "@/src/hooks/useAutoGenFields";
import type { Section, Post, Author, Tag, PostForm, SeoForm } from "@/src/types";
import { initialPostForm, initialSeoForm, toPostForm } from "@/src/utils/modelForm";

export function usePostForm(post: Post | null, onSave: () => void) {
    const [form, setForm] = useState<PostForm>({ ...initialPostForm });
    const [seo, setSeo] = useState<SeoForm>({ ...initialSeoForm });

    const [authors, setAuthors] = useState<Author[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);
    const [saving] = useState(false);

    const { handleSourceFocus, handleSourceBlur, handleManualEdit } = useAutoGenFields({
        configs: [
            {
                editingKey: "title",
                source: form.title ?? "",
                target: "slug",
                setter: (v) => setForm((f) => ({ ...f, slug: slugify(v ?? "") })),
                transform: slugify,
            },
            {
                editingKey: "title",
                source: form.title ?? "",
                target: "seo.title",
                setter: (v) => setSeo((s) => ({ ...s, title: v ?? "" })),
            },
            {
                editingKey: "excerpt",
                source: form.excerpt ?? "",
                target: "seo.description",
                setter: (v) => setSeo((s) => ({ ...s, description: v ?? "" })),
            },
        ],
    });

    useEffect(() => {
        fetchAuthors();
        fetchTagsAndSections();
        if (post) {
            loadPostData(post);
        } else {
            resetForm();
        }
    }, [post]);

    // --------- Handlers ---------

    function handlePostChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        if (name === "slug") {
            handleManualEdit("slug");
            setForm((p) => ({ ...p, slug: slugify(value) }));
        } else if (name === "title") {
            setForm((p) => ({ ...p, title: value }));
        } else if (name === "excerpt") {
            setForm((p) => ({ ...p, excerpt: value }));
        } else {
            setForm((p) => ({ ...p, [name]: value }));
        }
    }

    function handleTitleFocus() {
        handleSourceFocus("title");
    }
    function handleTitleBlur() {
        handleSourceBlur("title");
    }
    function handleExcerptFocus() {
        handleSourceFocus("excerpt");
    }
    function handleExcerptBlur() {
        handleSourceBlur("excerpt");
    }

    function toggleTag(tagId: string) {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    }

    function toggleSection(sectionId: string) {
        setSelectedSectionIds((prev) =>
            prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
        );
    }

    // ----------- Service Relations ------------

    async function syncRelations(postId: string) {
        const currentTagIds = await postTagService.listByParent(postId);
        const tagsToAdd = selectedTagIds.filter((id) => !currentTagIds.includes(id));
        const tagsToRemove = currentTagIds.filter((id) => !selectedTagIds.includes(id));
        const currentSectionIds = await sectionPostService.listByChild(postId);
        const sectionsToAdd = selectedSectionIds.filter((id) => !currentSectionIds.includes(id));
        const sectionsToRemove = currentSectionIds.filter((id) => !selectedSectionIds.includes(id));
        await Promise.all([
            ...tagsToAdd.map((tagId) => postTagService.create(postId, tagId)),
            ...tagsToRemove.map((tagId) => postTagService.delete(postId, tagId)),
            ...sectionsToAdd.map((sectionId) => sectionPostService.create(sectionId, postId)),
            ...sectionsToRemove.map((sectionId) => sectionPostService.delete(sectionId, postId)),
        ]);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.authorId) {
            alert("Veuillez sélectionner un auteur.");
            return;
        }
        const isUpdate = Boolean(post?.id);
        const postId = await savePost(isUpdate);
        await syncRelations(postId);
        resetForm();
        onSave();
    }

    async function fetchAuthors() {
        const { data } = await crudService("Author").list();
        setAuthors(data ?? []);
    }

    async function fetchTagsAndSections() {
        const [tagData, sectionData] = await Promise.all([
            crudService("Tag").list(),
            crudService("Section").list(),
        ]);
        setTags(tagData.data ?? []);
        setSections(sectionData.data ?? []);
    }

    async function loadPostData(post: Post) {
        const [tagIds, sectionIds] = await Promise.all([
            postTagService.listByParent(post.id),
            sectionPostService.listByChild(post.id),
        ]);
        const formData = toPostForm(post, tagIds, sectionIds);
        setForm(formData);
        setSeo(formData.seo);
        setSelectedTagIds(tagIds);
        setSelectedSectionIds(sectionIds);
    }

    async function savePost(isUpdate: boolean): Promise<string> {
        const { tagIds, sectionIds, ...postInput } = form;
        void tagIds;
        void sectionIds;

        if (isUpdate && post?.id) {
            const { data } = await crudService("Post").update({
                id: post.id,
                ...postInput,
                seo,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'article.");
            return data.id;
        } else {
            const { data } = await crudService("Post").create({ ...postInput, seo });
            if (!data) throw new Error("Erreur lors de la création de l'article.");
            return data.id;
        }
    }

    function resetForm() {
        setForm({ ...initialPostForm });
        setSeo({ ...initialSeoForm });
        setSelectedTagIds([]);
        setSelectedSectionIds([]);
    }

    return {
        form,
        seo,
        authors,
        tags,
        sections,
        selectedTagIds,
        selectedSectionIds,
        saving,
        handlePostChange,
        handleTitleFocus,
        handleTitleBlur,
        handleExcerptFocus,
        handleExcerptBlur,
        toggleTag,
        toggleSection,
        handleSubmit,
        setForm,
    };
}

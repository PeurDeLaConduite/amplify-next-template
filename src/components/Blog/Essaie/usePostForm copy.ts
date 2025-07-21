"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

type PostFormFields = {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: "draft" | "published";
    authorId: string;
};

type SeoFields = {
    title: string;
    description: string;
    image: string;
};

type SectionForm = {
    slug: string;
    title: string;
    description: string;
    order: number;
    seo: SeoFields;
    postIds: string[];
};

const initialSectionForm: SectionForm = {
    slug: "",
    title: "",
    description: "",
    order: 1,
    seo: { title: "", description: "", image: "" },
    postIds: [],
};

export function usePostForm(post: Schema["Post"]["type"] | null, onSave: () => void) {
    // --- POST STATES ---
    const [form, setForm] = useState<PostFormFields>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        authorId: "",
    });
    const [seo, setSeo] = useState<SeoFields>({ title: "", description: "", image: "" });
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);
    const [autoSeo, setAutoSeo] = useState(true);
    const [authors, setAuthors] = useState<Schema["Author"]["type"][]>([]);
    const [tags, setTags] = useState<Schema["Tag"]["type"][]>([]);
    const [sectionsList, setSectionsList] = useState<Schema["Section"]["type"][]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);

    // --- SECTION CRUD STATES ---
    const [sectionForm, setSectionForm] = useState<SectionForm>(initialSectionForm);
    const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
    const [savingSection, setSavingSection] = useState(false);

    // Fetch initial data
    useEffect(() => {
        void (async () => {
            await Promise.all([fetchAuthors(), fetchTagsAndSections(), fetchSections()]);
        })();
    }, []);

    // Load post when editing
    useEffect(() => {
        if (post) void loadPostData(post);
    }, [post]);

    // Auto‑slug / SEO title
    useEffect(() => {
        if (!isEditingTitle) return;
        const t = form.title.trim();
        if (!t) {
            if (autoSlug) setForm((p) => ({ ...p, slug: "" }));
            if (autoSeo) setSeo((p) => ({ ...p, title: "" }));
            return;
        }
        if (autoSlug) setForm((p) => ({ ...p, slug: slugify(t) }));
        if (autoSeo) setSeo((p) => ({ ...p, title: t }));
    }, [form.title, isEditingTitle, autoSlug, autoSeo]);

    // ------- POST HANDLERS -------
    function handleTitleFocus() {
        setIsEditingTitle(true);
    }
    function handleTitleBlur() {
        setIsEditingTitle(false);
        const gen = slugify(form.title.trim());
        setAutoSlug(form.slug === "" || form.slug === gen);
        setAutoSeo(seo.title === "" || seo.title === form.title);
    }
    function handlePostChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (name === "slug") setAutoSlug(false);
    }
    function handleSeoChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setSeo((p) => ({ ...p, [name]: value }));
        if (name === "title") setAutoSeo(false);
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
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!form.authorId) return alert("Veuillez sélectionner un auteur.");
        const isUpdate = Boolean(post?.id);
        const postId = await savePost(isUpdate);
        if (isUpdate && post?.id) await cleanupRelations(post.id);
        await Promise.all([
            ...selectedTagIds.map((tagId) => client.models.PostTag.create({ postId, tagId })),
            ...selectedSectionIds.map((sectionId) =>
                client.models.SectionPost.create({ postId, sectionId })
            ),
        ]);
        resetForm();
        onSave();
    }

    // ------- SECTION HANDLERS -------
    async function fetchSections() {
        const { data } = await client.models.Section.list();
        setSectionsList(data ?? []);
    }
    function handleSectionFieldChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        if (name.startsWith("seo.")) {
            const key = name.split(".")[1];
            setSectionForm((f) => ({ ...f, seo: { ...f.seo, [key]: value } }));
        } else {
            setSectionForm((f) => ({ ...f, [name]: value }));
        }
    }
    function handleSectionPostIdsChange(postIds: string[]) {
        setSectionForm((f) => ({ ...f, postIds }));
    }
    async function handleSectionEdit(idx: number) {
        setEditingSectionIndex(idx);
        const s = sectionsList[idx];
        const { data: links } = await client.models.SectionPost.list({
            filter: { sectionId: { eq: s.id } },
        });
        setSectionForm({
            slug: s.slug || "",
            title: s.title || "",
            description: s.description || "",
            order: s.order || 1,
            seo: {
                title: s.seo?.title ?? "",
                description: s.seo?.description ?? "",
                image: s.seo?.image ?? "",
            },
            postIds: links.map((l) => l.postId),
        });
    }
    function handleSectionCancel() {
        setEditingSectionIndex(null);
        setSectionForm(initialSectionForm);
    }
    async function handleSectionSave() {
        setSavingSection(true);
        let sectionId: string;
        if (editingSectionIndex === null) {
            const { data: section } = await client.models.Section.create({
                ...sectionForm,
            });
            sectionId = section!.id;
        } else {
            const id = sectionsList[editingSectionIndex].id;
            await client.models.Section.update({ id, ...sectionForm });
            sectionId = id;
        }
        // sync relations
        const { data: links } = await client.models.SectionPost.list({
            filter: { sectionId: { eq: sectionId } },
        });
        const current = links.map((l) => l.postId);
        const toAdd = sectionForm.postIds.filter((id) => !current.includes(id));
        const toRemove = current.filter((id) => !sectionForm.postIds.includes(id));
        await Promise.all([
            ...toAdd.map((pid) => client.models.SectionPost.create({ sectionId, postId: pid })),
            ...toRemove.map((pid) => client.models.SectionPost.delete({ sectionId, postId: pid })),
        ]);

        await fetchSections();
        setSavingSection(false);
        handleSectionCancel();
    }
    async function handleSectionDelete(idx: number) {
        const id = sectionsList[idx].id;
        await client.models.Section.delete({ id });
        setSectionsList((prev) => prev.filter((_, i) => i !== idx));
    }

    // --- AUX UTILS: fetchAuthors, fetchTagsAndSections, loadPostData, savePost, cleanupRelations, resetForm, slugify ---
    async function fetchAuthors() {
        const { data } = await client.models.Author.list();
        setAuthors(data ?? []);
    }
    async function fetchTagsAndSections() {
        const [tagData] = await Promise.all([client.models.Tag.list()]);
        setTags(tagData.data ?? []);
    }
    async function loadPostData(post: Schema["Post"]["type"]) {
        setForm({
            title: post.title ?? "",
            slug: post.slug ?? "",
            excerpt: post.excerpt ?? "",
            content: post.content ?? "",
            status: post.status ?? "draft",
            authorId: post.authorId ?? "",
        });
        setSeo({
            title: post.seo?.title ?? "",
            description: post.seo?.description ?? "",
            image: post.seo?.image ?? "",
        });
        const [{ data: tagLinks }, { data: sectionLinks }] = await Promise.all([
            client.models.PostTag.list({ filter: { postId: { eq: post.id } } }),
            client.models.SectionPost.list({ filter: { postId: { eq: post.id } } }),
        ]);
        setSelectedTagIds(tagLinks.map((t) => t.tagId));
        setSelectedSectionIds(sectionLinks.map((s) => s.sectionId));
    }
    async function savePost(isUpdate: boolean): Promise<string> {
        if (isUpdate && post?.id) {
            const { data } = await client.models.Post.update({ id: post.id, ...form, seo });
            return data!.id;
        } else {
            const { data } = await client.models.Post.create({ ...form, seo });
            return data!.id;
        }
    }
    async function cleanupRelations(postId: string) {
        const [{ data: postTags }, { data: sectionPosts }] = await Promise.all([
            client.models.PostTag.list({ filter: { postId: { eq: postId } } }),
            client.models.SectionPost.list({ filter: { postId: { eq: postId } } }),
        ]);
        await Promise.all([
            ...postTags.map((pt) => client.models.PostTag.delete({ postId, tagId: pt.tagId })),
            ...sectionPosts.map((sp) =>
                client.models.SectionPost.delete({ postId, sectionId: sp.sectionId })
            ),
        ]);
    }
    function resetForm() {
        setForm({ title: "", slug: "", excerpt: "", content: "", status: "draft", authorId: "" });
        setSeo({ title: "", description: "", image: "" });
        setSelectedTagIds([]);
        setSelectedSectionIds([]);
    }
    function slugify(text: string) {
        return text
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");
    }

    return {
        // post
        form,
        seo,
        authors,
        tags,
        sectionsList,
        selectedTagIds,
        selectedSectionIds,
        handlePostChange,
        handleSeoChange,
        handleTitleFocus,
        handleTitleBlur,
        toggleTag,
        toggleSection,
        handleSubmit,

        // section
        sectionForm,
        editingSectionIndex,
        savingSection,
        handleSectionFieldChange,
        handleSectionPostIdsChange,
        handleSectionEdit,
        handleSectionCancel,
        handleSectionSave,
        handleSectionDelete,
    };
}

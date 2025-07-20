// usePostForm.ts
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

export function usePostForm(post: Schema["Post"]["type"] | null, onSave: () => void) {
    // états du form
    const [form, setForm] = useState<PostFormFields>({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        status: "draft",
        authorId: "",
    });
    const [seo, setSeo] = useState<SeoFields>({
        title: "",
        description: "",
        image: "",
    });

    // focus sur le titre
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    // flags d'auto‑génération
    const [autoSlug, setAutoSlug] = useState(true);
    const [autoSeo, setAutoSeo] = useState(true);

    // fetch auteurs, tags, sections...
    const [authors, setAuthors] = useState<Schema["Author"]["type"][]>([]);
    const [tags, setTags] = useState<Schema["Tag"]["type"][]>([]);
    const [sections, setSections] = useState<Schema["Section"]["type"][]>([]);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>([]);

    useEffect(() => {
        void (async () => {
            await Promise.all([fetchAuthors(), fetchTagsAndSections()]);
        })();
    }, []);

    useEffect(() => {
        if (post) {
            void loadPostData(post);
        }
    }, [post]);

    // Auto‑update slug & seo.title à chaque frappe, tant que focus sur title et flag auto actif
    useEffect(() => {
        if (!isEditingTitle) return;

        const t = form.title.trim();
        if (!t) {
            // si titre vide, on vide aussi automatiquement si flag auto
            if (autoSlug) setForm((p) => ({ ...p, slug: "" }));
            if (autoSeo) setSeo((p) => ({ ...p, title: "" }));
            return;
        }

        if (autoSlug) {
            setForm((p) => ({ ...p, slug: slugify(t) }));
        }
        if (autoSeo) {
            setSeo((p) => ({ ...p, title: t }));
        }
    }, [form.title, isEditingTitle, autoSlug, autoSeo]);

    // Handlers

    function handleTitleFocus() {
        setIsEditingTitle(true);
    }
    function handleTitleBlur() {
        setIsEditingTitle(false);

        // slug
        const gen = slugify(form.title.trim());
        if (form.slug === "" || form.slug === gen) {
            setAutoSlug(true);
        } else {
            setAutoSlug(false);
        }

        // seo.title
        if (seo.title === "" || seo.title === form.title) {
            setAutoSeo(true);
        } else {
            setAutoSeo(false);
        }
    }

    function handlePostChange(
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));

        // si l'utilisateur édite manuellement slug, on désactive l'auto‑slug
        if (name === "slug") {
            setAutoSlug(false);
        }
    }

    function handleSeoChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setSeo((p) => ({ ...p, [name]: value }));

        // si l'utilisateur édite manuellement le SEO title, on désactive l'auto‑seo
        if (name === "title") {
            setAutoSeo(false);
        }
    }

    // — Fonctions auxiliaires / handlers —

    function slugify(text: string) {
        return text
            .normalize("NFD") // décompose les caractères accentués
            .replace(/[\u0300-\u036f]/g, "") // enlève les diacritiques
            .toLowerCase()
            .trim()
            .replace(/[\s_]+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");
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
        if (!form.authorId) {
            alert("Veuillez sélectionner un auteur.");
            return;
        }
        const isUpdate = Boolean(post?.id);
        const postId = await savePost(isUpdate);
        if (isUpdate && post?.id) {
            await cleanupRelations(post.id);
        }
        await Promise.all([
            ...selectedTagIds.map((tagId) => client.models.PostTag.create({ postId, tagId })),
            ...selectedSectionIds.map((sectionId) =>
                client.models.SectionPost.create({ postId, sectionId })
            ),
        ]);
        resetForm();
        onSave();
    }

    async function fetchAuthors() {
        const { data } = await client.models.Author.list();
        setAuthors(data ?? []);
    }

    async function fetchTagsAndSections() {
        const [tagData, sectionData] = await Promise.all([
            client.models.Tag.list(),
            client.models.Section.list(),
        ]);
        setTags(tagData.data ?? []);
        setSections(sectionData.data ?? []);
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

        const [tagLinks, sectionLinks] = await Promise.all([
            client.models.PostTag.list({ filter: { postId: { eq: post.id } } }),
            client.models.SectionPost.list({ filter: { postId: { eq: post.id } } }),
        ]);

        setSelectedTagIds(tagLinks.data.map((t) => t.tagId));
        setSelectedSectionIds(sectionLinks.data.map((s) => s.sectionId));
    }

    async function savePost(isUpdate: boolean): Promise<string> {
        if (isUpdate && post?.id) {
            const { data } = await client.models.Post.update({
                id: post.id,
                ...form,
                seo,
            });
            if (!data) throw new Error("Erreur lors de la mise à jour de l'article.");
            return data.id;
        } else {
            const { data } = await client.models.Post.create({ ...form, seo });
            if (!data) throw new Error("Erreur lors de la création de l'article.");
            return data.id;
        }
    }

    async function cleanupRelations(postId: string) {
        const [postTags, sectionPosts] = await Promise.all([
            client.models.PostTag.list({ filter: { postId: { eq: postId } } }),
            client.models.SectionPost.list({ filter: { postId: { eq: postId } } }),
        ]);

        await Promise.all([
            ...postTags.data.map((pt) => client.models.PostTag.delete({ postId, tagId: pt.tagId })),
            ...sectionPosts.data.map((sp) =>
                client.models.SectionPost.delete({
                    postId,
                    sectionId: sp.sectionId,
                })
            ),
        ]);
    }

    function resetForm() {
        setForm({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            status: "draft",
            authorId: "",
        });
        setSeo({ title: "", description: "", image: "" });
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
        handlePostChange,
        handleSeoChange,
        handleTitleFocus,
        handleTitleBlur,
        toggleTag,
        toggleSection,
        handleSubmit,
    };
}

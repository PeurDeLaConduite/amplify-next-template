// src/components/Blog/Create/PostsForm.jsx
"use client";

import React from "react";
import EditableField from "./components/EditableField";
import EditableTextArea from "./components/EditableTextArea";
import SeoFields from "./components/SeoFields";
import FormActionButtons from "./FormActionButtons";
import ItemSelector from "./components/ItemSelector";
import AuthorSelector from "./components/AuthorSelector";
import useEditableForm from "@/src/hooks/useEditableForm";
import { DateTimeField } from "./components/DateTimeField";

// Import du wizard vidéo→IA→contenu
import ArticleCreationForm from "./components/ArticleCreationForm";

export default function PostsForm({ posts, setPosts, sections, setSections, authors }) {
    const initialForm = {
        postJsonId: "",
        slug: "",
        title: "",
        excerpt: "",
        content: "",
        authorJsonId: "",
        sectionJsonIds: [],
        relatedPostIds: [],
        videoUrl: "",
        subtitleSource: "",
        generatedPrompt: "",
        tags: "",
        type: "tutoriel",
        status: "published",
        seo: { title: "", description: "", image: "" },
        createdAt: "",
        updatedAt: "",
    };

    const { form, editingIndex, handleChange, handleSave, handleEdit, handleCancel, handleDelete } =
        useEditableForm({
            initialForm,
            items: posts,
            setItems: setPosts,
            relatedItems: sections,
            setRelatedItems: setSections,
            itemKey: "postJsonId",
            relationKey: "sectionJsonIds",
            relatedKey: "postJsonIds",
            idPrefix: "P",
            prepareItem: (item) => ({
                ...item,
                tags: Array.isArray(item.tags)
                    ? item.tags
                    : item.tags.split(",").map((t) => t.trim()),
            }),
        });

    // Quand on clique sur "Transformer la réponse", on reçoit l'objet JSON et on alimente chaque champ
    const handleParseResponse = (obj) => {
        handleChange({ target: { name: "title", value: obj.title || "" } });
        handleChange({ target: { name: "excerpt", value: obj.excerpt || "" } });
        handleChange({ target: { name: "content", value: obj.content || "" } });
        const tagsValue = Array.isArray(obj.tags) ? obj.tags.join(", ") : "";
        handleChange({ target: { name: "tags", value: tagsValue } });
        handleChange({ target: { name: "seo.title", value: obj.seo?.title || "" } });
        handleChange({ target: { name: "seo.description", value: obj.seo?.description || "" } });
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Création d’un nouvel article</h2>

            {/* Wizard vidéo → IA → JSON → remplissage automatique des champs */}
            {editingIndex === null && (
                <ArticleCreationForm
                    form={form}
                    handleChange={handleChange}
                    onParseResponse={handleParseResponse}
                />
            )}

            {/* Une fois que tout est généré, on affiche le reste du formulaire */}
            <form onSubmit={(e) => e.preventDefault()} className="grid gap-2">
                <EditableField
                    label="Titre de l’article"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Titre généré ou à saisir"
                />
                <EditableField
                    label="Extrait (introduction rapide)"
                    name="excerpt"
                    value={form.excerpt}
                    onChange={handleChange}
                    placeholder="Phrase d’accroche"
                />
                <EditableTextArea
                    label="Contenu (corps de l’article)"
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Copiez ici le texte généré par ChatGPT"
                />
                <AuthorSelector
                    authors={authors}
                    selectedId={form.authorJsonId}
                    onChange={(id) => handleChange({ target: { name: "authorJsonId", value: id } })}
                />
                <ItemSelector
                    items={sections}
                    idKey="sectionJsonId"
                    selectedIds={form.sectionJsonIds}
                    onChange={(ids) =>
                        handleChange({ target: { name: "sectionJsonIds", value: ids } })
                    }
                    label="Sections associées :"
                />
                <EditableField
                    label="Tags (ex : stress, conduite, examen)"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Tags séparés par des virgules"
                />
                <SeoFields seo={form.seo} readOnly={!!editingIndex} onChange={handleChange} />
                <DateTimeField
                    label="Date de création"
                    name="createdAt"
                    value={form.createdAt}
                    onChange={handleChange}
                />
                <DateTimeField
                    label="Dernière modification"
                    name="updatedAt"
                    value={form.updatedAt}
                    onChange={handleChange}
                />

                {editingIndex === null && (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Ajouter l’article
                    </button>
                )}
            </form>

            {/* Liste des articles créés */}
            <ul className="mt-4 space-y-2">
                {posts.map((post, idx) => (
                    <li
                        key={post.postJsonId}
                        className={`flex justify-between items-center p-2 ${
                            editingIndex === idx ? "bg-yellow-100 shadow-sm" : "border-b"
                        }`}
                    >
                        <strong>{post.title}</strong>
                        <FormActionButtons
                            editingIndex={editingIndex}
                            currentIndex={idx}
                            onEdit={() => handleEdit(idx)}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onDelete={() => handleDelete(idx)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

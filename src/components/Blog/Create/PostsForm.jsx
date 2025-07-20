// src/components/Blog/Create/PostsForm.tsx
"use client";
import React from "react";
import EditableField from "./components/EditableField";
import EditableTextArea from "./components/EditableTextArea";
import SeoFields from "./components/SeoFields";
import FormActionButtons from "./FormActionButtons";
import ItemSelector from "./components/ItemSelector";
import AuthorSelector from "./components/AuthorSelector";
import useEditableForm from "@/src/hooks/useEditableForm";
// import { DateTimeField } from "./components/DateTimeField";
import TagSelector from "./components/TagPostManager";
import TagCrudManager from "./components/TagsManager";
import ArticleCreationForm from "./components/ArticleCreationForm";

export default function PostsForm({
    posts,
    setPosts,
    sections,
    setSections,
    authors,
    tags,
    setTags,
    newTag,
    setNewTag,
    editTagId,
    setEditTagId,
    editTagName,
    setEditTagName,
    onAdd,
    onUpdate,
    onDelete,
    onAddTag,
    onUpdateTag,
    onDeleteTag,
}) {
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
        tagIds: [],
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
                tagIds: Array.isArray(item.tagIds)
                    ? item.tagIds
                    : typeof item.tagIds === "string" && item.tagIds.length > 0
                      ? item.tagIds.split(",").map((t) => t.trim())
                      : [],
            }),
            onAdd,
            onUpdate,
            onDelete,
        });

    // Wizard IA
    const handleParseResponse = (obj) => {
        handleChange({ target: { name: "title", value: obj.title || "" } });
        handleChange({ target: { name: "excerpt", value: obj.excerpt || "" } });
        handleChange({ target: { name: "content", value: obj.content || "" } });
        if (obj.tags) {
            const tagNames = Array.isArray(obj.tags) ? obj.tags : obj.tags.split(",");
            const foundIds = tags
                .filter((t) => tagNames.map((s) => s.trim()).includes(t.name))
                .map((t) => t.id);
            handleChange({ target: { name: "tagIds", value: foundIds } });
        }
        handleChange({ target: { name: "seo.title", value: obj.seo?.title || "" } });
        handleChange({ target: { name: "seo.description", value: obj.seo?.description || "" } });
    };

    return (
        <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Création d’un nouvel article</h2>
            {editingIndex === null && (
                <ArticleCreationForm
                    form={form}
                    handleChange={handleChange}
                    onParseResponse={handleParseResponse}
                />
            )}
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
                <SeoFields seo={form.seo} readOnly={!!editingIndex} onChange={handleChange} />
                {/* <TagSelector
                    tags={tags}
                    selectedIds={form.tagIds || []}
                    onChange={(ids) => handleChange({ target: { name: "tagIds", value: ids } })}
                /> */}
                {editingIndex === null && (
                    <>
                        <TagCrudManager
                            tags={tags}
                            newTag={newTag}
                            editTagId={editTagId}
                            editTagName={editTagName}
                            setNewTag={setNewTag}
                            setEditTagId={setEditTagId}
                            setEditTagName={setEditTagName}
                            onCreate={onAddTag}
                            onUpdate={onUpdateTag}
                            onDelete={onDeleteTag}
                        />

                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                        >
                            Ajouter l’article
                        </button>
                    </>
                )}
            </form>
            <ul className="mt-4 space-y-2">
                {posts.map((post, idx) => (
                    <li
                        key={post.id}
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

"use client";
import React from "react";
import RequireAdmin from "../../../RequireAdmin";
import { RefreshButton } from "@components/buttons";

import TagCrudManager from "../components/tag/TagManager";
import TagsAssociationManager from "../components/tag/PostTagsManager";
import { useTagForm } from "@src/entities/models/tag/hooks";

export default function PostsTagsManagerPage() {
    const {
        tags,
        posts,
        form,
        editingIndex,
        loading,
        setForm,
        handleEdit,
        handleCancel,
        handleSubmit,
        handleDelete,
        handleAddPostTag,
        handleRemovePostTag,
        tagsForPost,
        isTagLinked,
        fetchAll,
    } = useTagForm();

    const newTag = editingIndex === null ? form.name : "";
    const editTagId = editingIndex !== null ? tags[editingIndex].id : null;
    const editTagName = editingIndex !== null ? form.name : "";

    function setNewTag(value: string) {
        if (editingIndex === null) setForm({ ...form, name: value });
    }

    function setEditTagId(id: string | null) {
        if (id === null) handleCancel();
        else {
            const idx = tags.findIndex((t) => t.id === id);
            if (idx !== -1) handleEdit(idx);
        }
    }

    function setEditTagName(value: string) {
        if (editingIndex !== null) setForm({ ...form, name: value });
    }

    return (
        <RequireAdmin>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-bold flex-1">Gestion des tags par article</h1>
                    <RefreshButton onClick={fetchAll} label="Rafraîchir" />
                </div>
                <TagCrudManager
                    tags={tags}
                    newTag={newTag}
                    editTagId={editTagId}
                    editTagName={editTagName}
                    setNewTag={setNewTag}
                    setEditTagId={setEditTagId}
                    setEditTagName={setEditTagName}
                    onCreate={handleSubmit}
                    onUpdate={handleSubmit}
                    onDelete={(id: string) => {
                        const idx = tags.findIndex((t) => t.id === id);
                        if (idx !== -1) handleDelete(idx);
                    }}
                />
                <TagsAssociationManager
                    posts={posts}
                    tags={tags}
                    tagsForPost={tagsForPost}
                    isTagLinked={isTagLinked}
                    onAdd={handleAddPostTag}
                    onRemove={handleRemovePostTag}
                    loading={loading}
                />
            </div>
        </RequireAdmin>
    );
}

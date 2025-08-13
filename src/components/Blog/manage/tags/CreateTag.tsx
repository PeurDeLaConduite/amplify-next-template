"use client";
import React from "react";
import RequireAdmin from "../../../RequireAdmin";
import { RefreshButton } from "@components/buttons";

import TagCrudManager from "../components/tag/TagManager";
import TagsAssociationManager from "../components/tag/PostTagsManager";
import { useTagForm } from "@entities/models/tag/hooks";

export default function PostsTagsManagerPage() {
    const {
        form,
        extras: { tags, posts },
        mode,
        loading,
        handleChange,
        edit,
        cancel,
        save,
        remove,
        toggle,
        tagsForPost,
        isTagLinked,
        fetchAll,
    } = useTagForm();

    return (
        <RequireAdmin>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-bold flex-1">Gestion des tags par article</h1>
                    <RefreshButton onClick={fetchAll} label="Rafraîchir" />
                </div>
                <TagCrudManager
                    tags={tags}
                    mode={mode}
                    formName={form.name}
                    onChangeName={(v) => handleChange("name", v)}
                    onSubmit={save}
                    onEdit={(id: string) => {
                        const idx = tags.findIndex((t) => t.id === id);
                        if (idx !== -1) void edit(idx);
                    }}
                    onCancel={cancel}
                    onDelete={(id: string) => {
                        const idx = tags.findIndex((t) => t.id === id);
                        if (idx !== -1) void remove(idx);
                    }}
                />
                <TagsAssociationManager
                    posts={posts}
                    tags={tags}
                    tagsForPost={tagsForPost}
                    isTagLinked={isTagLinked}
                    onToggle={toggle}
                    loading={loading}
                />
            </div>
        </RequireAdmin>
    );
}

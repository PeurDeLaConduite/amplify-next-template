"use client";
import React from "react";
import RequireAdmin from "@components/RequireAdmin";
import { RefreshButton } from "@components/buttons";

import TagManager from "@components/Blog/manage/components/tag/TagManager";
import PostTagsManager from "@components/Blog/manage/components/tag/PostTagsManager";
import { useTagForm } from "@entities/models/tag/hooks";

export default function PostsTagsManagerPage() {
    const manager = useTagForm();
    const {
        extras: { tags, posts },
        loading,
        toggle,
        tagsForPost,
        isTagLinked,
        fetchAll,
    } = manager;

    return (
        <RequireAdmin>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-bold flex-1">Gestion des tags par article</h1>
                    <RefreshButton onClick={fetchAll} label="Rafraîchir" />
                </div>
                <TagManager manager={manager} />
                <PostTagsManager
                    posts={posts}
                    tags={tags}
                    tagsForPost={tagsForPost}
                    isTagLinked={isTagLinked}
                    toggle={toggle}
                    loading={loading}
                />
            </div>
        </RequireAdmin>
    );
}

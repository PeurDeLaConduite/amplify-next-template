"use client";
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import RequireAdmin from "../../RequireAdmin";
import { RefreshButton } from "@/src/components/buttons";

import TagCrudManager from "./components/tag/TagManager";
import TagsAssociationManager from "./components/tag/PostTagsManager";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PostsTagsManagerPage() {
    const [tags, setTags] = useState<Schema["Tag"]["type"][]>([]);
    const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
    const [postTags, setPostTags] = useState<Schema["PostTag"]["type"][]>([]);
    const [loading, setLoading] = useState(true);

    // CRUD State
    const [newTag, setNewTag] = useState("");
    const [editTagId, setEditTagId] = useState(null);
    const [editTagName, setEditTagName] = useState("");

    useEffect(() => {
        fetchAll();
    }, []);

    async function fetchAll() {
        setLoading(true);
        const [tagsData, postsData, postTagsData] = await Promise.all([
            client.models.Tag.list(),
            client.models.Post.list(),
            client.models.PostTag.list(),
        ]);
        setTags(tagsData.data);
        setPosts(postsData.data);
        setPostTags(postTagsData.data);
        setLoading(false);
    }

    // Liaisons PostTag
    async function handleAddPostTag(postId, tagId) {
        await client.models.PostTag.create({ postId, tagId });
        setPostTags((prev) => [...prev, { postId, tagId }]);
    }
    async function handleRemovePostTag(postId, tagId) {
        const { data } = await client.models.PostTag.list({
            filter: { postId: { eq: postId }, tagId: { eq: tagId } },
        });
        await Promise.all(data.map((pt) => client.models.PostTag.delete({ postId, tagId })));
        setPostTags((prev) => prev.filter((pt) => !(pt.postId === postId && pt.tagId === tagId)));
    }
    function tagsForPost(postId) {
        const tagIds = postTags.filter((pt) => pt.postId === postId).map((pt) => pt.tagId);
        return tags.filter((t) => tagIds.includes(t.id));
    }
    function isTagLinked(postId, tagId) {
        return postTags.some((pt) => pt.postId === postId && pt.tagId === tagId);
    }

    // CRUD tag handlers
    async function handleCreateTag() {
        if (!newTag.trim()) return;
        await client.models.Tag.create({ name: newTag.trim() });
        setNewTag("");
        fetchAll();
    }
    async function handleUpdateTag() {
        if (!editTagId || !editTagName.trim()) return;
        await client.models.Tag.update({ id: editTagId, name: editTagName.trim() });
        setEditTagId(null);
        setEditTagName("");
        fetchAll();
    }
    async function handleDeleteTag(tagId) {
        if (!window.confirm("Supprimer ce tag ?")) return;
        await client.models.Tag.delete({ id: tagId });
        fetchAll();
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
                    onCreate={handleCreateTag}
                    onUpdate={handleUpdateTag}
                    onDelete={handleDeleteTag}
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

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import RequireAdmin from "../../../RequireAdmin";
import { RefreshButton } from "@/src/components/buttons";

import TagsAssociationManager from "./tag/PostTagsManager";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PostsTagsManagerPage() {
    const [tags, setTags] = useState<Schema["Tag"]["type"][]>([]);
    const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
    const [postTags, setPostTags] = useState<Schema["PostTag"]["type"][]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAll = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Liaisons PostTag
    async function handleAddPostTag(postId: string, tagId: string) {
        await client.models.PostTag.create({ postId, tagId });
        fetchAll();
    }
    async function handleRemovePostTag(postId: string, tagId: string) {
        const { data } = await client.models.PostTag.list({
            filter: { postId: { eq: postId }, tagId: { eq: tagId } },
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await Promise.all(data.map((pt) => client.models.PostTag.delete({ postId, tagId })));
        setPostTags((prev) => prev.filter((pt) => !(pt.postId === postId && pt.tagId === tagId)));
    }
    function tagsForPost(postId: string) {
        const tagIds = postTags.filter((pt) => pt.postId === postId).map((pt) => pt.tagId);
        return tags.filter((t) => tagIds.includes(t.id));
    }
    function isTagLinked(postId: string, tagId: string) {
        return postTags.some((pt) => pt.postId === postId && pt.tagId === tagId);
    }
    return (
        <RequireAdmin>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-2xl font-bold flex-1">Gestion des tags par article</h1>
                    <RefreshButton onClick={fetchAll} label="Rafraîchir" />
                </div>
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

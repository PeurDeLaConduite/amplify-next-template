"use client";
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

import TagCrudManager from "./tag/TagManager";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function TagsManager() {
    const [tags, setTags] = useState<Schema["Tag"]["type"][]>([]);

    // CRUD State
    const [newTag, setNewTag] = useState("");
    const [editTagId, setEditTagId] = useState(null);
    const [editTagName, setEditTagName] = useState("");

    useEffect(() => {
        fetchAll();
    }, []);

    async function fetchAll() {
        const [tagsData] = await Promise.all([client.models.Tag.list()]);
        setTags(tagsData.data);
    }

    // Liaisons PostTag

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
    async function handleDeleteTag(tagId: string) {
        if (!window.confirm("Supprimer ce tag ?")) return;
        await client.models.Tag.delete({ id: tagId });
        fetchAll();
    }

    return (
        <div className="">
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
        </div>
    );
}

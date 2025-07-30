"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTags } from "@/src/services/useTags";

import TagCrudManager from "./tag/TagManager";
import type { Tag } from "@/src/types/models/tag";

export default function TagsManager() {
    const { list, create, update, delete: remove } = useTags();
    const [tags, setTags] = useState<Tag[]>([]);

    // CRUD State
    const [newTag, setNewTag] = useState("");
    const [editTagId, setEditTagId] = useState(null);
    const [editTagName, setEditTagName] = useState("");

    const fetchAll = useCallback(async () => {
        const data = await list();
        setTags(data);
    }, [list]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Liaisons PostTag

    // CRUD tag handlers
    async function handleCreateTag() {
        if (!newTag.trim()) return;
        await create({ name: newTag.trim() });
        setNewTag("");
        fetchAll();
    }

    async function handleUpdateTag() {
        if (!editTagId || !editTagName.trim()) return;
        await update(editTagId, { name: editTagName.trim() });
        setEditTagId(null);
        setEditTagName("");
        fetchAll();
    }

    async function handleDeleteTag(tagId: string) {
        if (!window.confirm("Supprimer ce tag ?")) return;
        await remove(tagId);
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

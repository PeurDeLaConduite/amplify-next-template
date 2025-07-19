import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
const client = generateClient<Schema>();

export default function TagSelector({ tags, selectedIds = [], onChange, postId }) {
    const [linkedTagIds, setLinkedTagIds] = useState(selectedIds);

    // Si mode édition (postId), récupère la vraie liste à chaque changement
    useEffect(() => {
        if (!postId) {
            setLinkedTagIds(selectedIds);
            return;
        }
        let mounted = true;
        client.models.PostTag.list({ filter: { postId: { eq: postId } } }).then(({ data }) => {
            if (mounted) setLinkedTagIds(data.map((pt) => pt.tagId));
        });
        return () => {
            mounted = false;
        };
    }, [postId, selectedIds]);

    const handleClick = async (tagId) => {
        // Mode création : local
        if (!postId) {
            if (selectedIds.includes(tagId)) {
                onChange(selectedIds.filter((id) => id !== tagId));
            } else {
                onChange([...selectedIds, tagId]);
            }
            return;
        }
        // Mode édition : live
        if (linkedTagIds.includes(tagId)) {
            // delete PostTag
            const { data } = await client.models.PostTag.list({
                filter: { postId: { eq: postId }, tagId: { eq: tagId } },
            });
            await Promise.all(
                data.map((pt) => client.models.PostTag.delete({ postId, tagId: pt.tagId }))
            );
            setLinkedTagIds((ids) => ids.filter((id) => id !== tagId));
        } else {
            await client.models.PostTag.create({ postId, tagId });
            setLinkedTagIds((ids) => [...ids, tagId]);
        }
    };

    const current = postId ? linkedTagIds : selectedIds;

    return (
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Tags associés :</label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleClick(tag.id)}
                        className={`px-3 py-1 rounded-lg border transition ${
                            current.includes(tag.id)
                                ? "bg-blue-600 text-white border-blue-700"
                                : "bg-gray-200 border-gray-300"
                        }`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

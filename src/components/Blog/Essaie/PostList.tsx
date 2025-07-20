import React from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs);

export default function PostList({
    posts,
    onEdit,
    onDelete,
}: {
    posts: Schema["Post"]["type"][];
    onEdit: (post: Schema["Post"]["type"]) => void;
    onDelete: () => void;
}) {
    const client = generateClient<Schema>();
    const handleDelete = async (id: string) => {
        if (confirm("Supprimer ce post ?")) {
            await client.models.Post.delete({ id });
            onDelete();
        }
    };

    return (
        <ul className="space-y-2">
            {posts.map((post) => (
                <li key={post.id} className="border p-2 flex justify-between items-center">
                    <div>
                        <strong>{post.title}</strong> – {post.status}
                    </div>
                    <div className="space-x-2">
                        <button onClick={() => onEdit(post)} className="text-blue-600">
                            Modifier
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="text-red-600">
                            Supprimer
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}

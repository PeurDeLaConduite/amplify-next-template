"use client";
import React from "react";
import FormActionButtons from "../components/FormActionButtons";
import { type PostType } from "@/src/entities/models/post";

interface Props {
    posts: PostType[];
    editingId: string | null;
    onEdit: (id: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

export default function PostList({ posts, editingId, onEdit, onSave, onCancel, onDelete }: Props) {
    // Pas de mutation d'ordre du state parent (slice())
    return (
        <ul className="mt-6 space-y-2">
            {posts
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((post) => {
                    const active = editingId === post.id;
                    return (
                        <li
                            key={post.id}
                            className={`flex justify-between items-center p-2 transition-colors duration-300 ${
                                active ? "bg-yellow-100 shadow-sm" : "border-b"
                            }`}
                        >
                            <div>
                                <strong>{post.title}</strong> (ordre : {post.order})
                            </div>
                            <FormActionButtons
                                editingId={editingId}
                                currentId={post.id}
                                onEdit={() => onEdit(post.id)}
                                onSave={onSave}
                                onCancel={onCancel}
                                onDelete={() => onDelete(post.id)}
                                isFormNew={false}
                            />
                        </li>
                    );
                })}
        </ul>
    );
}

"use client";
import React from "react";
import FormActionButtons from "../components/FormActionButtons";
import { type Post } from "@/src/entities/post";

interface Props {
    posts: Post[];
    editingIndex: number | null;
    onEdit: (idx: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (idx: number) => void;
}

export default function PostList({
    posts,
    editingIndex,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: Props) {
    // Pas de mutation d'ordre du state parent (slice())
    return (
        <ul className="mt-6 space-y-2">
            {posts
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((post, idx) => {
                    const active = editingIndex === idx;
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
                                editingIndex={editingIndex}
                                currentIndex={idx}
                                onEdit={() => onEdit(idx)}
                                onSave={onSave}
                                onCancel={onCancel}
                                onDelete={() => onDelete(idx)}
                                isFormNew={false}
                            />
                        </li>
                    );
                })}
        </ul>
    );
}

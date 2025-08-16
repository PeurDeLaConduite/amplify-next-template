import React from "react";
import { CommentWithTodoId } from "@src/features/todo/useTodosWithComments";

interface CommentListProps {
    comments: CommentWithTodoId[];
    onEditComment: (id: string, ownerId?: string) => void;
    onDeleteComment: (id: string, ownerId?: string) => void;
    canModify: (ownerId?: string | null) => boolean;
}

export default function CommentList({
    comments,
    onEditComment,
    onDeleteComment,
    canModify,
}: CommentListProps) {
    return (
        <ul className="ml-6 mt-2 space-y-1">
            {comments.map((comment) => (
                <li
                    key={comment.id}
                    className="flex items-center gap-2 bg-white rounded px-2 py-1 shadow-sm"
                >
                    <span>{comment.userName?.userName}</span>
                    <span className="flex-1 text-gray-800">{comment.content}</span>
                    {canModify(comment.userNameId) && (
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEditComment(comment.id, comment.userNameId)}
                                className="text-xs px-2 py-1 rounded bg-yellow-100 hover:bg-yellow-200 text-yellow-700 transition"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onDeleteComment(comment.id, comment.userNameId)}
                                className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
                            >
                                ❌
                            </button>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

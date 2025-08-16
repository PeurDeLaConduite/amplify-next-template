import React from "react";
import { CommentWithTodoId } from "@src/features/todo/useTodosWithComments";

interface CommentListProps {
    comments: CommentWithTodoId[];
    onEditComment: (id: string, ownerId?: string) => void;
    onDeleteComment: (id: string, ownerId?: string) => void;
    canModify: (ownerId?: string) => boolean;
}

export default function CommentList({
    comments,
    onEditComment,
    onDeleteComment,
    canModify,
}: CommentListProps) {
    return (
        <ul className="ml-4 mt-3 space-y-3">
            {comments.map((comment) => (
                <li
                    key={comment.id}
                    className="flex flex-col gap-2 bg-white rounded-lg px-3 py-2 shadow-md border border-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Créé par{" "}
                            <span className="font-medium text-gray-700">
                                {comment.userName?.userName || "Anonyme"}
                            </span>
                        </span>
                        {canModify(comment.userNameId) && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEditComment(comment.id, comment.userNameId)}
                                    className="text-xs px-2 py-1 rounded-md bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 transition"
                                >
                                    ✏️ Modifier
                                </button>
                                <button
                                    onClick={() => onDeleteComment(comment.id, comment.userNameId)}
                                    className="text-xs px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition"
                                >
                                    ❌ Supprimer
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-800 text-sm leading-snug">{comment.content}</p>
                </li>
            ))}
        </ul>
    );
}

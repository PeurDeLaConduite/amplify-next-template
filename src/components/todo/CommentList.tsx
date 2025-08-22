import React from "react";
import { CommentWithTodoId } from "@/src/components/todo/useTodosWithComments";
import { EditButton, DeleteButton } from "@components/ui/button";

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
                                <EditButton
                                    onClick={() => onEditComment(comment.id, comment.userNameId)}
                                    label="Modifier"
                                    className="text-xs"
                                />
                                <DeleteButton
                                    onClick={() => onDeleteComment(comment.id, comment.userNameId)}
                                    label="Supprimer"
                                    className="text-xs"
                                />
                            </div>
                        )}
                    </div>

                    <p className="text-gray-800 text-sm leading-snug">{comment.content}</p>
                </li>
            ))}
        </ul>
    );
}

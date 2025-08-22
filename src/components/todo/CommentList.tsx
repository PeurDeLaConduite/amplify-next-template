import React from "react";
import { CommentWithTodoId } from "@/src/components/todo/useTodosWithComments";
import { EditButton, DeleteButton } from "@/src/components/buttons/Buttons";

interface CommentListProps {
    comments: CommentWithTodoId[];
    enterEditMode: (id: string, ownerId?: string) => void;
    deleteForm: (id: string, ownerId?: string) => void;
    /**
     * Indique si l'utilisateur peut modifier ou supprimer le commentaire.
     */
    canModify: (ownerId?: string) => boolean;
}

export default function CommentList({
    comments,
    enterEditMode,
    deleteForm,
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
                                    onClick={() => enterEditMode(comment.id, comment.userNameId)}
                                    label="Modifier"
                                    className="text-xs"
                                    size="small"
                                />
                                <DeleteButton
                                    onClick={() => deleteForm(comment.id, comment.userNameId)}
                                    label="Supprimer"
                                    className="text-xs"
                                    size="small"
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

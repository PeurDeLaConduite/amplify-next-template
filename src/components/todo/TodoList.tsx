import React from "react";
import type { Schema } from "@/amplify/data/resource";
import { CommentWithTodoId } from "@/src/components/todo/useTodosWithComments";
import CommentList from "@/src/components/todo/CommentList";
import { DeleteButton, AddButton } from "@/src/components/buttons/Buttons";

interface TodoListProps {
    todos: Schema["Todo"]["type"][];
    comments: CommentWithTodoId[];
    onDeleteTodo: (id: string) => void;
    onAddComment: (todoId: string) => void;
    enterEditMode: (id: string, ownerId?: string) => void;
    deleteForm: (id: string, ownerId?: string) => void;
    /**
     * Vérifie si l'utilisateur courant est autorisé à modifier un contenu.
     */
    canModify: (ownerId?: string | null) => boolean;
}

export default function TodoList({
    todos,
    comments,
    onDeleteTodo,
    onAddComment,
    enterEditMode,
    deleteForm,
    canModify,
}: TodoListProps) {
    if (todos.length === 0)
        return <div className="text-gray-400 text-center py-12">Aucun todo pour le moment.</div>;

    return (
        <ul className="space-y-6">
            {todos.map((todo) => {
                const todoComments = comments.filter((c) => c.todoId === todo.id);
                return (
                    <li
                        key={todo.id}
                        className="p-4 bg-gray-50 rounded-xl shadow flex flex-col gap-2"
                    >
                        <div className="flex items-center justify-between">
                            <strong className="text-lg">{todo.content}</strong>
                            <div className="flex gap-2">
                                <DeleteButton
                                    onClick={() => onDeleteTodo(todo.id)}
                                    label="Supprimer"
                                    className="text-sm"
                                    size="small"
                                />
                                <AddButton
                                    onClick={() => onAddComment(todo.id)}
                                    label="Ajouter un commentaire"
                                    className="text-sm"
                                    size="small"
                                />
                            </div>
                        </div>
                        {todoComments.length > 0 && (
                            <CommentList
                                comments={todoComments}
                                enterEditMode={enterEditMode}
                                deleteForm={deleteForm}
                                canModify={canModify}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

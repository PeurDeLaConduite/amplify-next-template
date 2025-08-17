import React from "react";
import type { Schema } from "@/amplify/data/resource";
import { CommentWithTodoId } from "@src/features/todo/useTodosWithComments";
import CommentList from "@src/features/todo/CommentList";

interface TodoListProps {
    todos: Schema["Todo"]["type"][];
    comments: CommentWithTodoId[];
    onDeleteTodo: (id: string) => void;
    onAddComment: (todoId: string) => void;
    onEditComment: (id: string, ownerId?: string) => void;
    onDeleteComment: (id: string, ownerId?: string) => void;
    canModify: (ownerId?: string | null) => boolean;
}

export default function TodoList({
    todos,
    comments,
    onDeleteTodo,
    onAddComment,
    onEditComment,
    onDeleteComment,
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
                                <button
                                    onClick={() => onDeleteTodo(todo.id)}
                                    className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 text-sm transition"
                                >
                                    🗑️ Supprimer
                                </button>
                                <button
                                    onClick={() => onAddComment(todo.id)}
                                    className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 text-sm transition"
                                >
                                    💬 Ajouter un commentaire
                                </button>
                            </div>
                        </div>
                        {todoComments.length > 0 && (
                            <CommentList
                                comments={todoComments}
                                onEditComment={onEditComment}
                                onDeleteComment={onDeleteComment}
                                canModify={canModify}
                            />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

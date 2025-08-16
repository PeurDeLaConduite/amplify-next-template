/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser } from "aws-amplify/auth";
import { useTodoService, todoService } from "@src/entities/models/todo";
import { useCommentService, commentService } from "@src/entities/models/comment";
import { useCommentPermissions } from "@src/hooks/useCommentPermissions";

type CommentWithTodoId = {
    id: string;
    content?: string | null;
    createdAt: string;
    todoId?: string;
    postId?: string;
    userNameId?: string;
    userName?: { userName?: string | null } | null;
};

export default function TodosWithCommentsPage() {
    const [todos, setTodos] = useState<any[]>([]);
    const [comments, setComments] = useState<CommentWithTodoId[]>([]);
    const todoClient = useTodoService();
    const commentClient = useCommentService();
    const { canModifyComment } = useCommentPermissions();

    useEffect(() => {
        // -- Abonnement au mount
        const todoSub = (todoClient as any).observeQuery().subscribe({
            next: (data: any) => setTodos([...(data.items as Schema["Todo"]["type"][])]),
        });
        const commentSub = commentClient
            .observeQuery({
                selectionSet: [
                    "id",
                    "content",
                    "createdAt",
                    "todoId",
                    "postId",
                    "userNameId",
                    "userName.userName",
                ],
            })
            .subscribe({
                next: (data) => setComments([...(data.items as CommentWithTodoId[])]),
            });
        // -- Cleanup au unmount
        return () => {
            todoSub.unsubscribe();
            commentSub.unsubscribe();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // CRUD handlers (inchangés)
    const createTodo = () => {
        const content = window.prompt("Contenu du Todo ?");
        if (content) void todoService.create({ content });
    };

    const addComment = async (todoId: string) => {
        const content = window.prompt("Contenu du commentaire ?");
        if (!content) return;

        // on récupère { userId, username, ... }
        const { userId: userNameId } = await getCurrentUser();

        await commentService.create({
            content,
            todoId,
            userNameId,
        });
    };

    const editComment = async (id: string, ownerId?: string) => {
        if (!canModifyComment(ownerId)) return;
        const content = window.prompt("Modifier ce commentaire ?");
        if (!content) return;
        await commentService.update({ id, content });
    };

    const deleteComment = (id: string, ownerId?: string) => {
        if (!canModifyComment(ownerId)) return;
        if (confirm("Supprimer ce commentaire ?")) {
            void commentService.delete({ id });
        }
    };
    const deleteTodo = async (id: string) => {
        if (confirm("Supprimer ce Todo (et ses commentaires) ?")) {
            // 1. Récupère tous les commentaires liés au Todo
            const { data: comments } = await commentService.list({
                filter: { todoId: { eq: id } },
            });

            // 2. Supprime chaque commentaire
            if (comments) {
                for (const comment of comments) {
                    await commentService.delete({ id: comment.id });
                }
            }

            // 3. Supprime le Todo
            await todoService.delete({ id });
        }
    };

    return (
        <section className="py-4">
            <button
                onClick={createTodo}
                className="mb-8 w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition focus:ring-2 focus:ring-blue-300 focus:outline-none"
            >
                ➕ Ajouter un Todo
            </button>
            <TodoList
                todos={todos}
                comments={comments}
                onDeleteTodo={deleteTodo}
                onAddComment={addComment}
                onEditComment={editComment}
                onDeleteComment={deleteComment}
                canModify={canModifyComment}
            />
        </section>
    );
}

interface TodoListProps {
    todos: any[];
    comments: CommentWithTodoId[];
    onDeleteTodo: (id: string) => void;
    onAddComment: (todoId: string) => void;
    onEditComment: (id: string, ownerId?: string) => void;
    onDeleteComment: (id: string, ownerId?: string) => void;
    canModify: (ownerId?: string | null) => boolean;
}

function TodoList({
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

// Composant de gestion et affichage des commentaires
interface CommentListProps {
    comments: CommentWithTodoId[];
    onEditComment: (id: string, ownerId?: string) => void;
    onDeleteComment: (id: string, ownerId?: string) => void;
    canModify: (ownerId?: string | null) => boolean;
}

function CommentList({ comments, onEditComment, onDeleteComment, canModify }: CommentListProps) {
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

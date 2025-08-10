import React, { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { client } from "@src/entities/core";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser } from "aws-amplify/auth";

type CommentWithTodoId = {
    id: string;
    content?: string | null;
    createdAt: string;
    todoId?: string;
};

export default function TodosWithCommentsPage() {
    const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
    const [comments, setComments] = useState<CommentWithTodoId[]>([]);

    useEffect(() => {
        // -- Abonnement au mount
        const todoSub = client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
        const commentSub = client.models.Comment.observeQuery().subscribe({
            next: (data) => setComments([...(data.items as CommentWithTodoId[])]),
        });
        // -- Cleanup au unmount
        return () => {
            todoSub.unsubscribe();
            commentSub.unsubscribe();
        };
    }, []);

    // CRUD handlers (inchangés)
    const createTodo = () => {
        const content = window.prompt("Contenu du Todo ?");
        if (content) client.models.Todo.create({ content });
    };

    const addComment = async (todoId: string) => {
        const content = window.prompt("Contenu du commentaire ?");
        if (!content) return;

        // on récupère { userId, username, ... }
        const { userId: userNameId } = await getCurrentUser();

        await client.models.Comment.create({
            content,
            todoId,
            userNameId, // ← obligatoire d’après votre schéma
        });
    };

    const deleteComment = (id: string) => {
        if (confirm("Supprimer ce commentaire ?")) {
            client.models.Comment.delete({ id });
        }
    };
    const deleteTodo = async (id: string) => {
        if (confirm("Supprimer ce Todo (et ses commentaires) ?")) {
            // 1. Récupère tous les commentaires liés au Todo
            const { data: comments } = await client.models.Comment.list({
                filter: { todoId: { eq: id } },
            });

            // 2. Supprime chaque commentaire
            if (comments) {
                for (const comment of comments) {
                    await client.models.Comment.delete({ id: comment.id });
                }
            }

            // 3. Supprime le Todo
            await client.models.Todo.delete({ id });
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
                onDeleteComment={deleteComment}
            />
        </section>
    );
}

interface TodoListProps {
    todos: Schema["Todo"]["type"][];
    comments: CommentWithTodoId[];
    onDeleteTodo: (id: string) => void;
    onAddComment: (todoId: string) => void;
    onDeleteComment: (id: string) => void;
}

function TodoList({ todos, comments, onDeleteTodo, onAddComment, onDeleteComment }: TodoListProps) {
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
                                onDeleteComment={onDeleteComment}
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
    onDeleteComment: (id: string) => void;
}

function CommentList({ comments, onDeleteComment }: CommentListProps) {
    return (
        <ul className="ml-6 mt-2 space-y-1">
            {comments.map((comment) => (
                <li
                    key={comment.id}
                    className="flex items-center gap-2 bg-white rounded px-2 py-1 shadow-sm"
                >
                    <span className="flex-1 text-gray-800">{comment.content}</span>
                    <button
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-600 transition"
                    >
                        ❌
                    </button>
                </li>
            ))}
        </ul>
    );
}

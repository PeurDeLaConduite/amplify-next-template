"use client";

import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);
const client = generateClient<Schema>();

type CommentWithTodoId = {
    id: string;
    content?: string | null;
    createdAt: string;
    todoId?: string;
};

export default function TodosWithCommentsPage() {
    const { user, signOut } = useAuthenticator();

    const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
    const [comments, setComments] = useState<CommentWithTodoId[]>([]);

    // CRUD
    function createTodo() {
        const content = window.prompt("Contenu du Todo ?");
        if (content) client.models.Todo.create({ content });
    }

    function deleteTodo(id: string) {
        if (confirm("Supprimer ce Todo ?")) {
            client.models.Todo.delete({ id });
        }
    }

    function addComment(todoId: string) {
        const content = window.prompt("Contenu du commentaire ?");
        if (content) client.models.Comment.create({ content, todoId });
    }

    function deleteComment(id: string) {
        if (confirm("Supprimer ce commentaire ?")) {
            client.models.Comment.delete({ id });
        }
    }

    // LOADERS
    useEffect(() => {
        const todoSub = client.models.Todo.observeQuery().subscribe({
            next: ({ items }) => setTodos(items),
        });

        const commentSub = client.models.Comment.observeQuery({
            selectionSet: ["id", "content", "createdAt", "todo.id"],
        }).subscribe({
            next: ({ items }) =>
                setComments(
                    items.map((c) => ({
                        id: c.id,
                        content: c.content,
                        createdAt: c.createdAt,
                        todoId: c.todo?.id,
                    }))
                ),
        });

        return () => {
            todoSub.unsubscribe();
            commentSub.unsubscribe();
        };
    }, []);

    return (
        <main>
            <h1>{user?.signInDetails?.loginId} — Todos & Commentaires</h1>

            <button onClick={createTodo}>➕ Ajouter un Todo</button>

            <ul>
                {todos.map((todo) => {
                    const todoComments = comments.filter((c) => c.todoId === todo.id);

                    return (
                        <li key={todo.id}>
                            <strong>{todo.content}</strong>
                            <br />
                            <button onClick={() => deleteTodo(todo.id)}>🗑️ Supprimer</button>
                            <button onClick={() => addComment(todo.id)}>
                                💬 Ajouter un commentaire
                            </button>

                            {todoComments.length > 0 && (
                                <ul>
                                    {todoComments.map((comment) => (
                                        <li key={comment.id}>
                                            {comment.content}
                                            <button onClick={() => deleteComment(comment.id)}>
                                                ❌
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>

            <button onClick={signOut}>🚪 Se déconnecter</button>
        </main>
    );
}

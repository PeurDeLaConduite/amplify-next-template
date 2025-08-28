"use client";

import { useEffect, useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import { useTodoService } from "@src/entities/models/todo";
// import "@aws-amplify/ui-react/styles.css";
import "./../app/app.css";

export default function TodosPublicPage() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const todoClient = useTodoService();

    useEffect(() => {
        const sub = todoClient
            .observeQuery({
                authMode: "apiKey", // 👈 force l'accès public même sans connexion
            })
            .subscribe({
                next: ({ items }) => setTodos(items),
                error: (err) => console.error("observeQuery error", err),
            });

        return () => sub.unsubscribe();
    }, [todoClient]);

    return (
        <main>
            <h1>Liste des Todos (publique)</h1>
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>{todo.content}</li>
                ))}
            </ul>
        </main>
    );
}

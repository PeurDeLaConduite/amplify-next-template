"use client";

import { useEffect, useState } from "react";
import { client } from "@src/services";
import type { Schema } from "@/amplify/data/resource";
import "@aws-amplify/ui-react/styles.css";
import "./../app/app.css";

export default function TodosPublicPage() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

    useEffect(() => {
        const sub = client.models.Todo.observeQuery({
            authMode: "apiKey", // 👈 force l'accès public même sans connexion
        }).subscribe({
            next: ({ items }) => setTodos(items),
            error: (err) => console.error("observeQuery error", err),
        });

        return () => sub.unsubscribe();
    }, []);

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

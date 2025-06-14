"use client";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
    const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
    const { user, signOut } = useAuthenticator();

    const groups = user?.signInUserSession?.accessToken?.payload?.["cognito:groups"] || [];
    const isAdmin = groups.includes("ADMINS");

    useEffect(() => {
        client.models.Todo.observeQuery().subscribe({
            next: (data) => setTodos([...data.items]),
        });
    }, []);

    function createTodo() {
        const content = window.prompt("Todo content");
        if (content) {
            client.models.Todo.create({ content });
        }
    }

    function deleteTodo(id: string) {
        client.models.Todo.delete({ id });
    }

    return (
        <main>
            <h1>{isAdmin ? "Admin" : "User"}'s Todos</h1>
            {isAdmin && <button onClick={createTodo}>+ new</button>}
            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        {todo.content}
                        {isAdmin && <button onClick={() => deleteTodo(todo.id)}>Delete</button>}
                    </li>
                ))}
            </ul>
            <button onClick={signOut}>Sign out</button>
        </main>
    );
}

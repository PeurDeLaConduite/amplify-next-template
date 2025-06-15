"use client";

import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import TodosWithCommentsPage from "./TodosWithCommentsPage";
Amplify.configure(outputs);

export default function CommentsPage() {
    const { user, signOut } = useAuthenticator();

    return (
        <main>
            <h1>{user?.signInDetails?.loginId} — Todos & Commentaires</h1>

            <TodosWithCommentsPage />

            <button onClick={signOut}>🚪 Se déconnecter</button>
        </main>
    );
}

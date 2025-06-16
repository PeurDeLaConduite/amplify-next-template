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
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
            <div className="flex-col items-center justify-between mb-8">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    {user?.signInDetails?.loginId}{" "}
                    <span className="font-normal text-gray-500">— Todos & Commentaires</span>
                </h1>
                <TodosWithCommentsPage />
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow transition focus:ring-2 focus:ring-red-300 focus:outline-none"
                >
                    🚪 Se déconnecter
                </button>
            </div>
        </div>
    );
}

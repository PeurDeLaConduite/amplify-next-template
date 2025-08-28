"use client";

// import "@aws-amplify/ui-react/styles.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import TodosWithCommentsPage from "./TodosWithCommentsPage";

export default function CommentsPage() {
    const { user } = useAuthenticator();

    return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
            <div className="flex-col items-center justify-between mb-8">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    {user?.signInDetails?.loginId}{" "}
                    <span className="font-normal text-gray-500">— Todos & Commentaires</span>
                </h1>
                <TodosWithCommentsPage />
            </div>
        </div>
    );
}

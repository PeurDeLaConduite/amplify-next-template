import RequireAdmin from "../../../RequireAdmin";
import AuthorsForm from "./AuthorsForm";
import { useState } from "react";

export default function CreateAuthor() {
    const [message, setMessage] = useState("");

    return (
        <RequireAdmin>
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Éditeur de blog : Auteurs</h1>
                <AuthorsForm setMessage={setMessage} />
                {message && (
                    <p
                        className={`mt-2 text-sm ${
                            message.startsWith("Erreur") ? "text-red-600" : "text-green-600"
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </RequireAdmin>
    );
}

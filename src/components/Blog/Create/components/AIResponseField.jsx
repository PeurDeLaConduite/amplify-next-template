import React, { useState } from "react";

export default function AIResponseField({ value, onChange, onParse }) {
    const [error, setError] = useState("");

    const handleParse = () => {
        let jsonString = value.trim();

        // Si le JSON est dans un bloc Markdown ```json …```
        if (jsonString.startsWith("```")) {
            jsonString = jsonString
                .replace(/^```(?:json)?\s*\r?\n?/, "")
                .replace(/\r?\n?```$/, "")
                .trim();
        }

        try {
            const obj = JSON.parse(jsonString);
            onParse(obj);
            setError("");
        } catch (e) {
            setError(`JSON invalide 🔴 : ${e.message}`);
        }
    };

    return (
        <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Réponse de l’IA (JSON)</label>
            <textarea
                name="content"
                value={value}
                onChange={onChange}
                placeholder="Collez ici la réponse JSON de l’IA…"
                className="w-full min-h-32 border rounded px-3 py-2 bg-white focus:outline-none focus:ring"
            />
            <div className="flex items-center gap-2 mt-2">
                <button
                    type="button"
                    onClick={handleParse}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                >
                    Transformer la réponse
                </button>
                {error && <span className="text-red-600">{error}</span>}
            </div>
        </div>
    );
}

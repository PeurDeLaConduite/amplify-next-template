// components/AuthorSelector.jsx
import React from "react";

export default function AuthorSelector({ authors, selectedId, onChange }) {
    return (
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Auteur :</label>
            <div className="border rounded-md overflow-auto bg-gray-50">
                {authors.map((a) => (
                    <div
                        key={a.id}
                        className={`flex items-center p-2 cursor-pointer ${
                            selectedId === a.id ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                        onClick={() => onChange(a.id)}
                    >
                        <input
                            type="radio"
                            name="authorId"
                            checked={selectedId === a.id}
                            onChange={() => onChange(a.id)}
                            className="mr-2"
                        />
                        <span>
                            {a.id} – {a.authorName}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import React, { useState } from "react";
import { uploadData } from "aws-amplify/storage";
import RequireAdmin from "./RequireAdmin";

export default function AdminTodoUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Aucun fichier sélectionné.");
            return;
        }

        try {
            await uploadData({
                path: `publique-storage/${file.name}`,
                data: file,
                options: {
                    bucket: "PubliqueStorage",
                },
            }).result;

            setMessage(`Fichier "${file.name}" uploadé avec succès !`);
            setFile(null);
        } catch (error) {
            console.error("Erreur d'upload :", error);
            setMessage("Erreur pendant l'upload.");
        }
    };

    return (
        <RequireAdmin>
            <div className="bg-white shadow-md rounded-2xl p-6 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Uploader un AdminTodo</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-600 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Upload
                </button>
                {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
            </div>
        </RequireAdmin>
    );
}

// src/components/Blog/Create/components/SubtitlesDownloadButton.jsx
import React from "react";

// Simple détection d'URL YouTube ou TikTok
function isYouTubeUrl(url) {
    return typeof url === "string" && (url.includes("youtube.com") || url.includes("youtu.be"));
}

const baseBtn =
    "inline-block mt-1 mb-4 px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2";

export default function SubtitlesDownloadButton({ videoUrl, onDownload }) {
    if (!isYouTubeUrl(videoUrl)) return null;

    const downsubUrl = `https://downsub.com/?url=${encodeURIComponent(videoUrl)}`;

    const baseBtn =
        "inline-block mt-1 mb-4 px-3 py-1 rounded text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2";

    return (
        <div className="flex justify-between items-center w-full gap-3">
            <a
                href={downsubUrl}
                onClick={onDownload}
                target="_blank"
                rel="noopener noreferrer"
                className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700`}
                aria-label="Télécharger les sous-titres de la vidéo (DownSub)"
                title="Télécharger les sous-titres de la vidéo"
            >
                Télécharger les sous-titres (DownSub)
            </a>

            <button
                type="button"
                onClick={onDownload}
                className={`${baseBtn} bg-green-600 text-white hover:bg-green-700`}
                aria-label="Passer à l’étape suivante"
                title="Étape suivante"
            >
                Suivant
            </button>
        </div>
    );
}

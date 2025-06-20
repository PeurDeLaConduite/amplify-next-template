// src/components/Blog/VideoEmbed.tsx
"use client";

import React, { useEffect } from "react";

function getYouTubeId(url?: string): string | null {
    if (typeof url !== "string") return null;
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
        if (u.hostname.includes("youtube.com")) {
            if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2];
            if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2];
            if (u.pathname.startsWith("/v/")) return u.pathname.split("/")[2];
            return u.searchParams.get("v");
        }
    } catch {}
    return null;
}

function getTikTokId(url?: string): string | null {
    if (typeof url !== "string") return null;
    const m = url.match(/(?:tiktok\.com\/@[^/]+\/video\/|vm\.tiktok\.com\/)(\d+)/);
    return m?.[1] ?? null;
}

type Props = {
    url?: string;
    title?: string;
};

const VideoEmbed: React.FC<Props> = ({ url, title }) => {
    const ytId = getYouTubeId(url);
    const tkId = getTikTokId(url);

    useEffect(() => {
        if (!tkId) return;
        const SCRIPT_ID = "__tiktok-embed-js";
        if (!document.getElementById(SCRIPT_ID)) {
            const s = document.createElement("script");
            s.id = SCRIPT_ID;
            s.src = "https://www.tiktok.com/embed.js";
            s.async = true;
            document.body.appendChild(s);
        }
    }, [tkId]);

    if (ytId) {
        return (
            <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${ytId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title || "YouTube video"}
                />
            </div>
        );
    }

    if (tkId) {
        return (
            <blockquote
                className="tiktok-embed"
                cite={url}
                data-video-id={tkId}
                style={{ maxWidth: 605, minWidth: 325 }}
            >
                <section>Chargement de la vidéo TikTok…</section>
            </blockquote>
        );
    }

    return null;
};

export default VideoEmbed;

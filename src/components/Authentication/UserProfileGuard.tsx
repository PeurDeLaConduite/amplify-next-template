"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/src/context/AuthContext";
export default function UserProfileGuard({
    signOut,
    children,
}: {
    signOut: () => void;
    children: React.ReactNode;
}) {
    // const { refreshProfile } = useAuth();
    const { globalLogout } = useAuth();
    // const handleLogout = () => {
    //     Cookies.remove("userProfile");
    //     signOut();
    //     refreshProfile(); // met à jour le contexte Auth
    // };
    const [firstName, setFirstName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const cookieProfile = Cookies.get("userProfile");

        if (!cookieProfile) {
            router.push("/profile");
            return;
        }

        try {
            const parsed = JSON.parse(cookieProfile);
            setFirstName(parsed.firstName || "");
            setFamilyName(parsed.familyName || "");
            setLoading(false);
        } catch (e) {
            console.error("Erreur lecture cookie userProfile", e);
            router.push("/profile");
        }
    }, [router]);

    if (loading)
        return (
            <p>
                Vous êtes connecté.
                <br /> Chargement du profil en cours...
            </p>
        );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="p-4 border-b border-gray-200 flex justify-between items-center">
                <p>
                    Connecté en tant que :{" "}
                    <strong>
                        {firstName} {familyName}
                    </strong>
                </p>
                <button
                    onClick={() => globalLogout(signOut)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                    Se déconnecter
                </button>
            </header>
            <main className="p-6">{children}</main>
        </div>
    );
}

"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

interface RequireAdminProps {
    children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdminGroup = async () => {
            try {
                const session = await fetchAuthSession();
                const groups = session.tokens?.idToken?.payload["cognito:groups"];

                if (Array.isArray(groups) && groups.includes("ADMINS")) {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Erreur lors de la vérification du groupe :", err);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAdminGroup();
    }, []);

    if (loading) {
        return <p className="text-gray-600">Vérification des autorisations...</p>;
    }

    if (!isAdmin) {
        return (
            <p className="text-red-600 font-semibold">
                Accès refusé. Cette section est réservée aux administrateurs.
            </p>
        );
    }

    return <>{children}</>;
}

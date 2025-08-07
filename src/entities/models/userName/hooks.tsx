// src/entities/user/hooks.ts
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { client } from "@src/services";

export function useUserName() {
    const { user } = useAuthenticator();
    const [userName, setUserName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        // si pas connecté, on vide et on sort
        if (!user) {
            setUserName("");
            return;
        }
        const sub = user.username; // par défaut, `username` === sub Cognito
        setLoading(true);

        const fetchUserName = async () => {
            try {
                const { data } = await client.models.UserName.get({ id: sub });
                setUserName(data?.userName ?? "");
            } catch {
                // si erreur (not found…), on considère qu'il n'y a pas encore de pseudo
                setUserName("");
            } finally {
                setLoading(false);
            }
        };

        fetchUserName();
    }, [user]);

    const updateUserName = useCallback(
        async (newUserName: string) => {
            if (!user) return;
            const sub = user.username;
            setLoading(true);

            try {
                // on tente la mise à jour
                await client.models.UserName.update({
                    id: sub,
                    userName: newUserName,
                    owner: sub,
                });
                setUserName(newUserName);
            } catch (err: unknown) {
                const error = err as {
                    name?: string;
                    errors?: { message?: string }[];
                };
                const notFound =
                    error?.name === "NotFound" ||
                    error?.name === "NotFoundError" ||
                    error?.errors?.some((e) => e.message?.toLowerCase().includes("not found"));

                if (notFound) {
                    // si n'existe pas, on crée
                    await client.models.UserName.create({
                        id: sub,
                        userName: newUserName,
                        owner: sub,
                    });
                    setUserName(newUserName);
                } else {
                    throw err;
                }
            } finally {
                setLoading(false);
            }
        },
        [user]
    );

    return { userName, updateUserName, loading };
}

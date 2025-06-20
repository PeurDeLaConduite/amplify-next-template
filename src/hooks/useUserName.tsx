// src/hooks/useUserName.ts
import { useEffect, useState, useCallback } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export function useUserName() {
    const { user } = useAuthenticator();
    const [userName, setUserName] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setUserName("");
            return;
        }
        setLoading(true);
        const fetchUserName = async () => {
            try {
                const { data } = await client.models.UserName.get({ id: user.userId });
                setUserName(data?.userName ?? "");
            } catch {
                setUserName("");
            }
            setLoading(false);
        };
        fetchUserName();
    }, [user]);

    // updateUserName disponible partout
    const updateUserName = useCallback(
        async (newUserName: string) => {
            if (!user) return;
            setLoading(true);
            await client.models.UserName.update({
                id: user.userId,
                userName: newUserName,
                owner: user.userId,
            });
            setUserName(newUserName);
            setLoading(false);
        },
        [user]
    );

    return { userName, updateUserName, loading };
}

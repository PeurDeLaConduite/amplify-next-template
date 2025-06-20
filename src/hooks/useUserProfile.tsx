"use client";

import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { MinimalProfile } from "@/src/components/Profile/utilsProfile";

const client = generateClient<Schema>();

type UserProfile = Schema["UserProfile"]["type"];

export function useUserProfile() {
    const { user } = useAuthenticator();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const subscription = client.models.UserProfile.observeQuery().subscribe(
            {
                next: ({ items }) => {
                    setProfile(items[0] ?? null);
                    setLoading(false);
                },
                error: err => {
                    console.error("Error fetching profile:", err);
                    setError(err);
                    setLoading(false);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [user]);

    const update = async (data: Partial<UserProfile>) => {
        if (!profile) return;
        try {
            const { data: updated } = await client.models.UserProfile.update({
                id: profile.id,
                ...data
            });
            setProfile(updated);
            return updated;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const create = async (data: MinimalProfile) => {
        try {
            const input: Omit<UserProfile, "id"> = {
                ...data,
                owner: user?.username ?? "anonymous",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const { data: created } = await client.models.UserProfile.create(
                input
            );
            setProfile(created);
            return created;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const remove = async () => {
        if (!profile) return;
        try {
            await client.models.UserProfile.delete({ id: profile.id });
            setProfile(null);
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    return {
        profile,
        loading,
        error,
        update,
        create,
        remove
    };
}

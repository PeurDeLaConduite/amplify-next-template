// src/entities/profile/hooks.ts
"use client";

import { useEffect, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { MinimalProfile } from "@/src/components/Profile/utilsProfile";
import {
    type UserProfileType,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    observeUserProfile,
} from "@src/entities";

export function useUserProfile() {
    const { user } = useAuthenticator();
    const [profile, setProfile] = useState<UserProfileType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const sub = user.userId ?? user.username;
        const subscription = observeUserProfile(sub, (item) => {
            setProfile(item);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [user]);

    const update = async (data: Partial<UserProfileType>) => {
        if (!profile) return;
        try {
            const { data: updated } = await updateUserProfile(profile.id, data);
            setProfile(updated);
            return updated;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    };

    const create = async (data: MinimalProfile) => {
        try {
            const sub = user?.userId ?? user?.username;
            if (!sub) throw new Error("sub manquant");
            const { data: created } = await createUserProfile(sub, data);
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
            await deleteUserProfile(profile.id);
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
        remove,
    };
}

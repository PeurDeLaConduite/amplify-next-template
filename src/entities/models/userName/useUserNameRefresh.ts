// src/entities/models/userName/useUserNameRefresh.ts
"use client";
import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { onUserNameUpdated } from "./bus";

export function useUserNameRefresh(options: {
    refresh: () => Promise<void>;
    enabled?: boolean;
    onAuthChange?: boolean;
}) {
    const { refresh, enabled = true, onAuthChange = true } = options;
    const { user } = useAuthenticator();

    // ✅ relance à CHAQUE changement d'auth (login + logout)
    useEffect(() => {
        if (!onAuthChange) return;
        void refresh();
    }, [user?.userId, onAuthChange, refresh]);

    // ✅ écoute du bus
    useEffect(() => {
        if (!enabled) return;
        const unsub = onUserNameUpdated(() => {
            void refresh();
        });
        return unsub;
    }, [enabled, refresh]);
}

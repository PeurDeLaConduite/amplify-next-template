// src/entities/models/userName/useUserNameRefresh.ts
"use client";

import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { onUserNameUpdated } from "./bus";

/**
 * Rafraîchit le userName :
 *  - au login/logout (si onAuthChange = true)
 *  - à chaque évènement du bus (si enabled = true)
 */
export function useUserNameRefresh(options: {
    refresh: () => Promise<void>;
    enabled?: boolean; // ex: true ou "est-ce que le modal est ouvert ?"
    onAuthChange?: boolean; // rafraîchir quand l'user change
}) {
    const { refresh, enabled = true, onAuthChange = true } = options;
    const { user } = useAuthenticator();

    // 1) Rafraîchir quand l'utilisateur (auth) change
    useEffect(() => {
        if (!onAuthChange) return;
        if (user) void refresh();
    }, [user, onAuthChange, refresh]);

    // 2) Écouter le bus uniquement quand c'est utile
    useEffect(() => {
        if (!enabled) return;
        const unsub = onUserNameUpdated(() => {
            void refresh();
        });
        return unsub;
    }, [enabled, refresh]);
}

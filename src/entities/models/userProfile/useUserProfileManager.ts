// src/entities/models/userProfile/hooks.ts
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserProfileManager } from "./manager";
import { getUserSub } from "@entities/core/auth/getUserSub";

export function useUserProfileManager() {
    const mgr = useMemo(() => createUserProfileManager(), []);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, mgr.getState);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const sub = await getUserSub();
                if (!alive) return;
                await mgr.loadEntityById(sub); // hydrate le form en mode édition
                await mgr.refresh(); // actualise list (1 item : moi)
            } catch {
                // non connecté : on reste sur le form initial
            }
        })();
        return () => {
            alive = false;
        };
    }, [mgr]);

    return { ...state, ...mgr };
}

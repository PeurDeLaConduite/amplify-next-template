// src/entities/models/userName/hooks.ts
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserNameManager } from "./manager";
import { getUserSub } from "@entities/core/auth/getUserSub";

export function useUserNameManager() {
    const mgr = useMemo(() => createUserNameManager(), []);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, mgr.getState);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const sub = await getUserSub(); // ✅ sub fiable
                if (!alive) return;
                await mgr.loadEntityById(sub); // ✅ CHARGEMENT DU FORM
                await mgr.refreshExtras(); // optionnel
            } catch {
                // pas connecté : on laisse le form initial
            }
        })();
        return () => {
            alive = false;
        };
    }, [mgr]);

    return { ...state, ...mgr };
}

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserProfileManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserProfile.
 */
export function useUserProfileManager(userId?: string | null) {
    const mgr = useMemo(() => createUserProfileManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        if (userId) {
            mgr.enterEdit(userId);
            void mgr.refresh();
            void mgr.refreshExtras();
        }
    }, [mgr, userId]);

    return { ...state, ...mgr };
}

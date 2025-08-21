import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserProfileManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserProfile.
 */
export function useUserProfileManager() {
    const mgr = useMemo(() => createUserProfileManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

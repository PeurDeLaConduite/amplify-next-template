import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserProfileManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserProfile.
 */
export function useUserProfileManager() {
    const mgr = useMemo(() => createUserProfileManager(), []);
    const state = useSyncExternalStore(
        mgr.subscribe?.bind(mgr) ?? (() => () => {}),
        () => mgr.getState(),
        () => mgr.getState()
    );

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

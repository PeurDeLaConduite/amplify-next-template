import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserNameManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserName.
 */
export function useUserNameManager() {
    const mgr = useMemo(() => createUserNameManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

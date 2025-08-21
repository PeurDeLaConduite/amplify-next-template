import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserNameManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserName.
 */
export function useUserNameManager(sub?: string) {
    const mgr = useMemo(() => createUserNameManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        if (!sub) return;
        mgr.enterEdit(sub);
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr, sub]);

    return { ...state, ...mgr };
}

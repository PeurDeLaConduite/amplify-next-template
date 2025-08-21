import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createAuthorManager } from "./manager";

/**
 * Hook React pour gérer l'entité Author.
 */
export function useAuthorManager() {
    const mgr = useMemo(() => createAuthorManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

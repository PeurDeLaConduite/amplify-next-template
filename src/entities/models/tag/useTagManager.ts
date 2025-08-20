import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createTagManager } from "./manager";

/**
 * Hook React pour gérer l'entité Tag.
 */
export function useTagManager() {
    const mgr = useMemo(() => createTagManager(), []);
    const state = useSyncExternalStore(
        mgr.subscribe,
        () => mgr.getState(),
        () => mgr.getState()
    );

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createAuthorManager } from "./manager";

/**
 * Hook React pour gérer l'entité Author.
 */
export function useAuthorManager() {
    const mgr = useMemo(() => createAuthorManager(), []);
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

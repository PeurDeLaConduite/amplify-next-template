import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createPostManager } from "./manager";

/**
 * Hook React pour gérer l'entité Post.
 */
export function usePostManager() {
    const mgr = useMemo(() => createPostManager(), []);
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

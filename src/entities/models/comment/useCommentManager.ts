import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createCommentManager } from "./manager";

/**
 * Hook React pour gérer l'entité Comment.
 */
export function useCommentManager() {
    const mgr = useMemo(() => createCommentManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createCommentManager } from "./manager";

/**
 * Hook React pour gérer l'entité Comment.
 */
export function useCommentManager() {
    const mgr = useMemo(() => createCommentManager(), []);
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

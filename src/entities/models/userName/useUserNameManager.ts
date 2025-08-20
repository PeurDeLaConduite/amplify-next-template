import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserNameManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserName.
 */
export function useUserNameManager() {
    const mgr = useMemo(() => createUserNameManager(), []);
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

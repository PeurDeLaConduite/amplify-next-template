import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createUserNameManager } from "./manager";

/**
 * Hook React pour gérer l'entité UserName.
 */
export function useUserNameManager() {
    const mgr = useMemo(() => createUserNameManager(), []);
    const initialState = useMemo(() => mgr.getState(), [mgr]);
    // prettier-ignore
    const state = useSyncExternalStore(
        mgr.subscribe,
        mgr.getState,
        () => initialState
    );

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

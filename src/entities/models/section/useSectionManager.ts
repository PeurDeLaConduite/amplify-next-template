import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createSectionManager } from "./manager";

/**
 * Hook React pour gérer l'entité Section.
 */
export function useSectionManager() {
    const mgr = useMemo(() => createSectionManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

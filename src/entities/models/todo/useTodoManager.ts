import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createTodoManager } from "./manager";

/**
 * Hook React pour gérer l'entité Todo.
 */
export function useTodoManager() {
    const mgr = useMemo(() => createTodoManager(), []);
    const serverSnapshot = useMemo(() => mgr.getState(), [mgr]);
    const state = useSyncExternalStore(mgr.subscribe, mgr.getState, () => serverSnapshot);

    useEffect(() => {
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr };
}

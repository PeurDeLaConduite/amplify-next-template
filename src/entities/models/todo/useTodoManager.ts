import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createTodoManager } from "./manager";

/**
 * Hook React pour gérer l'entité Todo.
 */
export function useTodoManager() {
    const mgr = useMemo(() => createTodoManager(), []);
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

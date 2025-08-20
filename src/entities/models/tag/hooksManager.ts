import { useEffect, useMemo, useSyncExternalStore } from "react";
import { createTagManager } from "./manager";

<<<<<<< Updated upstream
// export function useTagManager() {
//     const mgr = useMemo(() => createTagManager(), []);
//     const state = useSyncExternalStore(
//         mgr.subscribe!,
//         () => ({ ...mgr }),
//         () => ({ ...mgr })
//     );
=======
export function useTagManager() {
    const mgr = useMemo(() => createTagManager(), []);
    const state = useSyncExternalStore(
        mgr.subscribe!,
        () => mgr.getState(),
        () => mgr.getState()
    );
>>>>>>> Stashed changes

    useEffect(() => {
        // charge liste + extras au mount
        void mgr.refresh();
        void mgr.refreshExtras();
    }, [mgr]);

    return { ...state, ...mgr }; // .form, .extras, .updateField, .createEntity, etc.
}

// src/entities/user/hooks.ts
import { useMemo, useCallback } from "react";
import useEntityManager from "@/src/hooks/useEntityManager";
import { getUserName, createUserName, updateUserName, deleteUserName } from "@src/entities";
import { useAuthenticator } from "@aws-amplify/ui-react";
import {
    MinimalUserName,
    normalizeUserName,
    fieldLabel,
} from "@src/components/Profile/utilsUserName";

export function useUserNameManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;

    // 1. Memoize fetch et tout ce qui ne doit pas changer
    const fetch = useCallback(async () => {
        if (!sub) return null;
        const item = await getUserName(sub);
        if (!item) return null;
        return { userName: item.userName ?? "" };
    }, [sub]);

    const fields = useMemo(() => ["userName"], []);
    const initialData = useMemo(() => normalizeUserName(), []);

    return useEntityManager<MinimalUserName>({
        fetch,
        create: async (data) => {
            if (!sub) return;
            await createUserName(sub, data.userName);
        },
        update: async (_entity, data) => {
            if (!sub) return;
            await updateUserName(sub, data.userName ?? "");
        },
        remove: async () => {
            if (!sub) return;
            await deleteUserName(sub);
        },
        fields,
        labels: fieldLabel,
        initialData,
    });
}

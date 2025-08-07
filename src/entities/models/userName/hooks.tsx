// src/entities/user/hooks.ts
import useEntityManager, { type FieldConfig } from "@src/hooks/useEntityManagerGeneral";
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

    // Fetch UserName
    const fetch = async () => {
        if (!sub) return null;
        const item = await getUserName(sub);
        if (!item) return null;
        const data: MinimalUserName & { id?: string } = {
            userName: item.userName ?? "",
        };
        return data;
    };

    const config: FieldConfig<MinimalUserName> = {
        userName: {
            parse: (v: string) => v,
            serialize: (v: string) => v,
            emptyValue: "",
        },
    };

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
        fields: ["userName"],
        labels: fieldLabel,
        initialData: normalizeUserName(),
        config,
    });
}

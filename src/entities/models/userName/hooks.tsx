// src/entities/models/userName/hooks.tsx
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldConfig } from "@src/entities/core/hooks";
import { label, type MinimalUserName } from "@src/components/Profile/utilsUserName";
import {
    getUserName,
    createUserName,
    updateUserName,
    deleteUserName,
} from "@src/entities/models/userName/service";

export function useUserNameManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    const [error, setError] = useState<Error | null>(null);

    const fetch = async () => {
        if (!sub) return null;
        try {
            const item = await getUserName(sub);
            if (!item) return null;
            return { id: sub, userName: item.userName ?? "" };
        } catch (e) {
            setError(e as Error);
            return null;
        }
    };

    const create = async (data: MinimalUserName) => {
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await createUserName(sub, data.userName);
        } catch (e) {
            setError(e as Error);
        }
    };

    const update = async (
        _entity: (MinimalUserName & { id?: string }) | null,
        data: Partial<MinimalUserName>
    ) => {
        void _entity;
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await updateUserName(sub, data.userName ?? "");
        } catch (e) {
            setError(e as Error);
        }
    };

    const remove = async (_entity: (MinimalUserName & { id?: string }) | null) => {
        void _entity;
        if (!sub) return;
        try {
            setError(null);
            await deleteUserName(sub);
        } catch (e) {
            setError(e as Error);
        }
    };

    const initialData: MinimalUserName = { userName: "" };

    const fieldConfig: FieldConfig<MinimalUserName> = {
        userName: {
            parse: (v: string) => v,
            serialize: (v: string) => v,
            emptyValue: "",
        },
    };

    const manager = useEntityManager<MinimalUserName>({
        fetch,
        create,
        update,
        remove,
        labels: label,
        fields: ["userName"],
        initialData,
        config: fieldConfig,
    });

    return { ...manager, error };
}

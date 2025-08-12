// src/entities/models/userName/hooks.tsx
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { label } from "@src/components/Profile/utilsUserName";
import {
    getUserName,
    createUserName,
    updateUserName,
    deleteUserName,
} from "@entities/models/userName/service";
import { type UserNameMinimalType } from "@entities/models/userName/types";

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

    const create = async (data: UserNameMinimalType) => {
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await createUserName(sub, data.userName);
        } catch (e) {
            setError(e as Error);
        }
    };

    const update = async (
        _entity: (UserNameMinimalType & { id?: string }) | null,
        data: Partial<UserNameMinimalType>
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

    const remove = async (_entity: (UserNameMinimalType & { id?: string }) | null) => {
        void _entity;
        if (!sub) return;
        try {
            setError(null);
            await deleteUserName(sub);
        } catch (e) {
            setError(e as Error);
        }
    };

    const initialData: UserNameMinimalType = { userName: "" };

    const fieldConfig: FieldConfig<UserNameMinimalType> = {
        userName: {
            parse: (v) => String(v),
            serialize: (v: string) => v,
            emptyValue: "",
        },
    };

    const manager = useEntityManager<UserNameMinimalType>({
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

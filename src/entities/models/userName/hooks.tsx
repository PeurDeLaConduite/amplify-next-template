// src/entities/models/userName/hooks.tsx
import { useState, useMemo } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { label as fieldLabel } from "@/src/components/Profile/utilsUserName";
import { userNameService as userNameServiceFactory } from "@entities/models/userName/service";
import { extractGroups, type AuthUser } from "@entities/core";
import { type UserNameMinimalType } from "@entities/models/userName/types";

export function useUserNameManager() {
    const { user } = useAuthenticator();

    const authUser = useMemo<AuthUser | null>(() => {
        if (!user) return null;
        const username =
            (user as unknown as { userId?: string })?.userId ??
            (user as unknown as { username?: string })?.username ??
            undefined;
        return { username, groups: extractGroups(user) };
    }, [user]);

    const svc = useMemo(() => userNameServiceFactory(authUser), [authUser]);
    const sub = authUser?.username;
    const [error, setError] = useState<Error | null>(null);

    const fetch = async () => {
        if (!sub) return null;
        try {
            const { data: item } = await svc.get({ id: sub });
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
            await svc.create({ id: sub, ...data });
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
            await svc.update({ id: sub, ...data });
        } catch (e) {
            setError(e as Error);
        }
    };

    const remove = async (_entity: (UserNameMinimalType & { id?: string }) | null) => {
        void _entity;
        if (!sub) return;
        try {
            setError(null);
            await svc.delete({ id: sub });
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
        labels: fieldLabel,
        fields: ["userName"],
        initialData,
        config: fieldConfig,
    });

    return { ...manager, error };
}

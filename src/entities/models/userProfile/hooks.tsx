// src/entities/models/userProfile/hooks.tsx
import { useState, useMemo } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { label as fieldLabel } from "@/src/components/Profile/utilsUserProfile";
import { userProfileService as userProfileServiceFactory } from "@entities/models/userProfile/service";
import { extractGroups, type AuthUser } from "@entities/core";
import { type UserProfileMinimalType } from "@entities/models/userProfile/types";

export function useUserProfileManager() {
    const { user } = useAuthenticator();

    const authUser = useMemo<AuthUser | null>(() => {
        if (!user) return null;
        const username =
            (user as unknown as { userId?: string })?.userId ??
            (user as unknown as { username?: string })?.username ??
            undefined;
        return { username, groups: extractGroups(user) };
    }, [user]);

    const svc = useMemo(() => userProfileServiceFactory(authUser), [authUser]);
    const sub = authUser?.username;
    const [error, setError] = useState<Error | null>(null);

    const fetch = async () => {
        if (!sub) return null;
        try {
            const { data: item } = await svc.get({ id: sub });
            if (!item) return null;
            const data: UserProfileMinimalType & { id?: string } = {
                id: sub,
                firstName: item.firstName ?? "",
                familyName: item.familyName ?? "",
                phoneNumber: item.phoneNumber ?? "",
                address: item.address ?? "",
                postalCode: item.postalCode ?? "",
                city: item.city ?? "",
                country: item.country ?? "",
            };
            return data;
        } catch (e) {
            setError(e as Error);
            return null;
        }
    };

    const create = async (data: UserProfileMinimalType) => {
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await svc.create({ id: sub, ...data });
        } catch (e) {
            setError(e as Error);
        }
    };

    const update = async (
        _entity: (UserProfileMinimalType & { id?: string }) | null,
        data: Partial<UserProfileMinimalType>
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

    const remove = async (_entity: (UserProfileMinimalType & { id?: string }) | null) => {
        void _entity;
        if (!sub) return;
        try {
            setError(null);
            await svc.delete({ id: sub });
        } catch (e) {
            setError(e as Error);
        }
    };

    const initialData: UserProfileMinimalType = {
        firstName: "",
        familyName: "",
        phoneNumber: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
    };

    const fieldConfig: FieldConfig<UserProfileMinimalType> = {
        firstName: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
        familyName: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
        phoneNumber: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
        address: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
        postalCode: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
        city: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
        country: { parse: (v) => String(v), serialize: (v: string) => v, emptyValue: "" },
    };

    const manager = useEntityManager<UserProfileMinimalType>({
        fetch,
        create,
        update,
        remove,
        labels: fieldLabel,
        fields: [
            "firstName",
            "familyName",
            "phoneNumber",
            "address",
            "postalCode",
            "city",
            "country",
        ],
        initialData,
        config: fieldConfig,
    });

    return { ...manager, error };
}

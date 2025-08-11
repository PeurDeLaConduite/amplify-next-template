// src/entities/models/userProfile/hooks.tsx
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldConfig } from "@entities/core/hooks";
import { label as fieldLabel } from "@/src/components/Profile/utilsUserProfile";
import {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
} from "@entities/models/userProfile/service";
import { type UserProfileMinimalType } from "@entities/models/userProfile/types";

export function useUserProfileManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    const [error, setError] = useState<Error | null>(null);

    const fetch = async () => {
        if (!sub) return null;
        try {
            const item = await getUserProfile(sub);
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
            await createUserProfile(sub, data);
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
            await updateUserProfile(sub, data);
        } catch (e) {
            setError(e as Error);
        }
    };

    const remove = async (_entity: (UserProfileMinimalType & { id?: string }) | null) => {
        void _entity;
        if (!sub) return;
        try {
            setError(null);
            await deleteUserProfile(sub);
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
        firstName: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        familyName: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        phoneNumber: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        address: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        postalCode: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        city: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        country: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
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

// src/entities/models/userProfile/hooks.tsx
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldConfig } from "@src/entities/core/hooks";
import { fieldLabel, type MinimalProfile } from "@src/entities/models/userProfile";
import {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
} from "@src/entities/models/userProfile/service";

export function useUserProfileManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    const [error, setError] = useState<Error | null>(null);

    const fetch = async () => {
        if (!sub) return null;
        try {
            const item = await getUserProfile(sub);
            if (!item) return null;
            const data: MinimalProfile & { id?: string } = {
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

    const create = async (data: MinimalProfile) => {
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await createUserProfile(sub, data);
        } catch (e) {
            setError(e as Error);
        }
    };

    const update = async (
        _entity: (MinimalProfile & { id?: string }) | null,
        data: Partial<MinimalProfile>
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

    const remove = async (_entity: (MinimalProfile & { id?: string }) | null) => {
        void _entity;
        if (!sub) return;
        try {
            setError(null);
            await deleteUserProfile(sub);
        } catch (e) {
            setError(e as Error);
        }
    };

    const initialData: MinimalProfile = {
        firstName: "",
        familyName: "",
        phoneNumber: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
    };

    const fieldConfig: FieldConfig<MinimalProfile> = {
        firstName: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        familyName: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        phoneNumber: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        address: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        postalCode: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        city: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
        country: { parse: (v: string) => v, serialize: (v: string) => v, emptyValue: "" },
    };

    const manager = useEntityManager<MinimalProfile>({
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

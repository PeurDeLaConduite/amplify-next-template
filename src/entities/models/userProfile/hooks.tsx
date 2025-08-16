// src/entities/models/userProfile/hooks.tsx
import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useModelForm, type UseModelFormResult } from "@entities/core/hooks";
import { label as fieldLabel } from "@/src/components/Profile/utilsUserProfile";
import { userProfileService } from "@entities/models/userProfile/service";
import { type UserProfileMinimalType } from "@entities/models/userProfile/types";

export interface UserProfileFormResult
    extends UseModelFormResult<UserProfileMinimalType, Record<string, unknown>> {
    fetchProfile: () => Promise<UserProfileMinimalType | null>;
    saveField: (field: keyof UserProfileMinimalType, value: string) => Promise<void>;
    clearField: (field: keyof UserProfileMinimalType) => Promise<void>;
    deleteProfile: () => Promise<void>;
    fields: (keyof UserProfileMinimalType)[];
    labels: (field: keyof UserProfileMinimalType) => string;
    error: Error | null;
}

export function useUserProfileForm(): UserProfileFormResult {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;
    const [error, setError] = useState<Error | null>(null);

    const initialForm: UserProfileMinimalType = {
        firstName: "",
        familyName: "",
        phoneNumber: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
    };

    const create = async (form: UserProfileMinimalType) => {
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await userProfileService.create({ id: sub, ...form } as unknown as Parameters<
                typeof userProfileService.create
            >[0]);
        } catch (e) {
            setError(e as Error);
        }
        return sub ?? "";
    };

    const update = async (form: UserProfileMinimalType) => {
        if (!sub) throw new Error("id manquant");
        try {
            setError(null);
            await userProfileService.update({ id: sub, ...form });
        } catch (e) {
            setError(e as Error);
        }
        return sub ?? "";
    };

    const formManager = useModelForm<UserProfileMinimalType>({
        initialForm,
        mode: "create",
        create,
        update,
    });

    const { setForm, adoptInitial, reset } = formManager;

    const fetchProfile = async (): Promise<UserProfileMinimalType | null> => {
        if (!sub) return null;
        try {
            const { data } = await userProfileService.get({ id: sub });
            if (!data) return null;
            const loaded: UserProfileMinimalType = {
                firstName: data.firstName ?? "",
                familyName: data.familyName ?? "",
                phoneNumber: data.phoneNumber ?? "",
                address: data.address ?? "",
                postalCode: data.postalCode ?? "",
                city: data.city ?? "",
                country: data.country ?? "",
            };
            adoptInitial(loaded, "edit");
            return loaded;
        } catch (e) {
            setError(e as Error);
            return null;
        }
    };

    const saveField = async (field: keyof UserProfileMinimalType, value: string): Promise<void> => {
        if (!sub) return;
        try {
            setError(null);
            await userProfileService.update({ id: sub, [field]: value });
            setForm((f) => ({ ...f, [field]: value }));
        } catch (e) {
            setError(e as Error);
        }
    };

    const clearField = async (field: keyof UserProfileMinimalType): Promise<void> => {
        await saveField(field, "");
    };

    const deleteProfile = async (): Promise<void> => {
        if (!sub) return;
        try {
            setError(null);
            await userProfileService.delete({ id: sub });
            adoptInitial(initialForm, "create");
            reset();
        } catch (e) {
            setError(e as Error);
        }
    };

    const fields: (keyof UserProfileMinimalType)[] = [
        "firstName",
        "familyName",
        "phoneNumber",
        "address",
        "postalCode",
        "city",
        "country",
    ];

    return {
        ...formManager,
        fetchProfile,
        saveField,
        clearField,
        deleteProfile,
        fields,
        labels: fieldLabel,
        error,
    };
}

export { fieldLabel };

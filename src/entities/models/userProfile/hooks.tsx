// @/src/hooks/useUserProfileManager.ts
"use client";
import { useAuthenticator } from "@aws-amplify/ui-react";
import useEntityManager from "@/src/hooks/useEntityManager";
import {
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUserProfile,
} from "@src/entities";
import {
    MinimalProfile,
    normalizeFormData,
    label as fieldLabel,
} from "@src/components/Profile/utilsProfile";

export function useUserProfileManager() {
    const { user } = useAuthenticator();
    const sub = user?.userId ?? user?.username;

    // Fonction de récupération du profil
    const fetch = async () => {
        if (!sub) return null;
        const item = await getUserProfile(sub);
        if (!item) return null;
        const data: MinimalProfile & { id?: string } = {
            id: item.id,
            firstName: item.firstName ?? "",
            familyName: item.familyName ?? "",
            address: item.address ?? "",
            postalCode: item.postalCode ?? "",
            city: item.city ?? "",
            country: item.country ?? "",
            phoneNumber: item.phoneNumber ?? "",
        };
        return data;
    };

    // Hook générique pour toute l’édition CRUD du profil
    return useEntityManager<MinimalProfile>({
        fetch,
        create: async (data) => {
            if (!sub) throw new Error("sub manquant");
            await createUserProfile(sub, data);
        },
        update: async (entity, data) => {
            if (!entity?.id) throw new Error("id manquant");
            await updateUserProfile(entity.id, data);
        },
        remove: async (entity) => {
            if (!entity?.id) return;
            await deleteUserProfile(entity.id);
        },
        fields: [
            "firstName",
            "familyName",
            "phoneNumber",
            "address",
            "postalCode",
            "city",
            "country",
        ],
        labels: fieldLabel,
        initialData: normalizeFormData({}),
    });
}

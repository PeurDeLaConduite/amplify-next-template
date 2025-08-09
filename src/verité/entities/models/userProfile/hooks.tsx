// @/src/hooks/useUserProfileManager.ts
import { createEntityHooks } from "@src/entities/createEntityHooks";
import { label as fieldLabel, MinimalProfile } from "@src/components/Profile/utilsProfile";
import {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
} from "@src/entities/models/userProfile/service";

export const useUserProfileManager = createEntityHooks<MinimalProfile>({
    model: "UserProfile",
    fields: ["firstName", "familyName", "phoneNumber", "address", "postalCode", "city", "country"],
    labels: fieldLabel,
    service: {
        get: async (id) =>
            (await getUserProfile(id)) as unknown as (MinimalProfile & { id?: string }) | null,
        create: (id, data) => createUserProfile(id, data).then(() => {}),
        update: (id, data) => updateUserProfile(id, data).then(() => {}),
        delete: (id) => deleteUserProfile(id).then(() => {}),
    },
});

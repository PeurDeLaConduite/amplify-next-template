// src/entities/models/userProfile/manager.ts
import { createManager } from "@entities/core";
import { userProfileService } from "@entities/models/userProfile/service";
import { getUserSub } from "@entities/core/auth/getUserSub";
import {
    initialUserProfileForm,
    toUserProfileForm,
    toUserProfileCreate,
    toUserProfileUpdate,
} from "@entities/models/userProfile/form";
import type { UserProfileType, UserProfileFormType } from "@entities/models/userProfile/types";

type Id = string;

export function createUserProfileManager() {
    return createManager<UserProfileType, UserProfileFormType, Id>({
        getInitialForm: () => ({ ...initialUserProfileForm }),

        // 🔒 liste "self-only" : renvoie au plus 1 item (moi)
        listEntities: async () => {
            const sub = await getUserSub().catch(() => null);
            if (!sub) return { items: [] };
            const { data } = await userProfileService.get({ id: sub });
            return { items: data ? [data as UserProfileType] : [] };
        },

        // 🔒 getEntityById "self-only" : refuse tout id ≠ sub
        getEntityById: async (idArg) => {
            const sub = await getUserSub().catch(() => null);
            if (!sub) return null;
            if (idArg && idArg !== sub) return null;
            const { data } = await userProfileService.get({ id: sub });
            return (data ?? null) as UserProfileType | null;
        },

        // 🆕 create : id = sub
        createEntity: async (form) => {
            const sub = await getUserSub();
            const { errors } = await userProfileService.create(
                toUserProfileCreate({ ...form, id: sub })
            );
            if (errors?.length) throw new Error(errors[0].message);
            return sub;
        },

        // ♻️ update avec upsert défensif (évite ConditionalCheckFailed)
        updateEntity: async (id, patch, { form }) => {
            const sub = await getUserSub();
            if (id !== sub) throw new Error("Forbidden: cannot edit another profile");
            const { data: existing } = await userProfileService.get({ id: sub });
            if (!existing) {
                const { errors } = await userProfileService.create(
                    toUserProfileCreate({ ...form, id: sub })
                );
                if (errors?.length) throw new Error(errors[0].message);
                return;
            }
            const { errors } = await userProfileService.update({
                id: sub,
                ...toUserProfileUpdate({ ...form, ...patch }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },

        // 🔒 delete "self-only"
        deleteById: async (id) => {
            const sub = await getUserSub();
            if (id !== sub) throw new Error("Forbidden: cannot delete another profile");
            await userProfileService.delete({ id: sub });
        },

        // mapping entity -> form
        toForm: toUserProfileForm,
    });
}

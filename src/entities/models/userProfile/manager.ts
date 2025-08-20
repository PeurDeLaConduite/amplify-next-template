import { createManager } from "@entities/core";
import { userProfileService } from "@entities/models/userProfile/service";
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
        listEntities: async ({ limit }) => {
            const { data } = await userProfileService.list({ limit });
            return { items: (data ?? []) as UserProfileType[] };
        },
        getEntityById: async (id) => {
            const { data } = await userProfileService.get({ id });
            return (data ?? null) as UserProfileType | null;
        },
        createEntity: async (form) => {
            const { data, errors } = await userProfileService.create(toUserProfileCreate(form));
            if (errors?.length) throw new Error(errors[0].message);
            return data.id;
        },
        updateEntity: async (id, data, { form }) => {
            const { errors } = await userProfileService.update({
                id,
                ...toUserProfileUpdate({ ...form, ...data }),
            });
            if (errors?.length) throw new Error(errors[0].message);
        },
        deleteById: async (id) => {
            await userProfileService.delete({ id });
        },
        toForm: toUserProfileForm,
    });
}

import { createManager } from "@entities/core";
import { userProfileService } from "@entities/models/userProfile/service";
import { getCurrentUser } from "aws-amplify/auth";
import {
    initialUserProfileForm,
    toUserProfileForm,
    toUserProfileCreate,
    toUserProfileUpdate,
} from "@entities/models/userProfile/form";
import type { UserProfileType, UserProfileFormType } from "@entities/models/userProfile/types";

type Id = string;

export function createUserProfileManager() {
    let manager: ReturnType<typeof createManager<UserProfileType, UserProfileFormType, Id>>;

    const listEntities = async () => {
        const id = manager.getState().editingId;
        if (!id) return { items: [] };
        const { data } = await userProfileService.get({ id });
        return { items: data ? [data as UserProfileType] : [] };
    };

    manager = createManager<UserProfileType, UserProfileFormType, Id>({
        getInitialForm: () => ({ ...initialUserProfileForm }),
        listEntities,
        getEntityById: async (id) => {
            const { data } = await userProfileService.get({ id });
            return (data ?? null) as UserProfileType | null;
        },
        createEntity: async (form) => {
            const { userId } = await getCurrentUser();
            const formWithId = { ...form, id: userId };
            const { errors } = await userProfileService.create(toUserProfileCreate(formWithId));
            if (errors?.length) throw new Error(errors[0].message);
            return userId;
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

    const baseRefresh = manager.refresh.bind(manager);
    manager.refresh = async () => {
        const id = manager.getState().editingId;
        if (!id) return;
        await baseRefresh();
    };

    const baseEnterEdit = manager.enterEdit.bind(manager);
    manager.enterEdit = (id) => {
        baseEnterEdit(id);
        if (id) manager.patchForm({ id });
    };

    return manager;
}

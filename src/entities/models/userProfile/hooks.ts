// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { UserProfileFormType } from "./types";
import { userProfileConfig } from "./config";
import { userProfileService } from "./service";

const useUserProfileBase = createEntityHooks<UserProfileFormType>({
    ...userProfileConfig,
    service: userProfileService,
});

export const useUserProfileManager = useUserProfileBase;

export const useUserProfileForm = () => {
    const {
        form,
        mode,
        dirty,
        reset,
        submit,
        refresh,
        setForm,
        handleChange,
        fields,
        labels,
        saveField,
        clearField,
        remove,
        loading,
        error,
    } = useUserProfileBase();
    return {
        form,
        mode,
        dirty,
        reset,
        submit,
        refresh,
        setForm,
        handleChange,
        fields,
        labels,
        saveField,
        clearField,
        remove,
        loading,
        error,
    } as const;
};

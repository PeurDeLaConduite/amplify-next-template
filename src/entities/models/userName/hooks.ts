// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import type { UserNameFormType } from "./types";
import { userNameConfig } from "./config";
import { userNameService } from "./service";

const useUserNameBase = createEntityHooks<UserNameFormType>({
    ...userNameConfig,
    service: userNameService,
});

export const useUserNameManager = useUserNameBase;

export const useUserNameForm = () => {
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
    } = useUserNameBase();
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

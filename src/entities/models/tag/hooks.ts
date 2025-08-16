// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import type { TagFormType } from "./types";
import { tagConfig } from "./config";
import { tagService } from "./service";

const useTagBase = createEntityHooks<TagFormType>({
    ...tagConfig,
    service: tagService,
});

export const useTagManager = useTagBase;

export const useTagForm = () => {
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
    } = useTagBase();
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

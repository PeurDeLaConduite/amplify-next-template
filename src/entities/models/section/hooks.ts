// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import type { SectionFormType } from "./types";
import { sectionConfig } from "./config";
import { sectionService } from "./service";

const useSectionBase = createEntityHooks<SectionFormType>({
    ...sectionConfig,
    service: sectionService,
});

export const useSectionManager = useSectionBase;

export const useSectionForm = () => {
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
    } = useSectionBase();
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

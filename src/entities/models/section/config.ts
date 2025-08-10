import { initialSectionForm, toSectionForm } from "./form";
import type { SectionFormTypes, SectionTypesOmit, SectionTypesUpdateInput } from "./types";

export const sectionConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["slug", "title", "description", "order", "seo"],
    relations: ["posts"],
    toForm: toSectionForm,
    toCreate: (form: SectionFormTypes): SectionTypesOmit => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    toUpdate: (form: SectionFormTypes): SectionTypesUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    initialForm: initialSectionForm,
};

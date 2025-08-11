import { z, type ZodType } from "zod";
import {
    type SectionTypes,
    type SectionFormTypes,
    type SectionTypesUpdateInput,
} from "@src/entities/models/section/types";
import { toSeoForm, initialSeoForm } from "@src/entities/customTypes/seo/form";
import { createModelForm } from "@src/entities/core";

export const {
    zodSchema: sectionSchema,
    initialForm: initialSectionForm,
    toForm: toSectionForm,
    toCreate: toSectionCreate,
    toUpdate: toSectionUpdate,
} = createModelForm<
    SectionTypes,
    SectionFormTypes,
    SectionTypesUpdateInput,
    SectionTypesUpdateInput,
    [string[]]
>({
    zodSchema: z.object({
        slug: z.string(),
        title: z.string(),
        description: z.string(),
        order: z.number(),
        seo: z.any(),
        postIds: z.array(z.string()),
    }) as ZodType<SectionFormTypes>,
    initialForm: {
        slug: "",
        title: "",
        description: "",
        order: 1,
        seo: { ...initialSeoForm },
        postIds: [],
    },
    toForm: (section, postIds: string[] = []) => ({
        slug: section.slug ?? "",
        title: section.title ?? "",
        description: section.description ?? "",
        order: section.order ?? 1,
        seo: toSeoForm(section.seo),
        postIds,
    }),
    toCreate: (form: SectionFormTypes): SectionTypesUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    toUpdate: (form: SectionFormTypes): SectionTypesUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
});

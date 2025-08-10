import { type SectionTypes, type SectionFormTypes, toSeoForm } from "@src/entities";
import { createModelForm } from "@entities/core";
import { initialSeoForm } from "@/src/entities/customTypes/seo/form";

export const { initialForm: initialSectionForm, toForm: toSectionForm } = createModelForm<
    SectionTypes,
    SectionFormTypes,
    [string[]]
>(
    {
        slug: "",
        title: "",
        description: "",
        order: 1,
        seo: { ...initialSeoForm },
        postIds: [],
    },
    (section, postIds: string[] = []) => ({
        slug: section.slug ?? "",
        title: section.title ?? "",
        description: section.description ?? "",
        order: section.order ?? 1,
        seo: toSeoForm(section.seo),
        postIds,
    })
);

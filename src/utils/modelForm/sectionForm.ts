import type { Section, SectionForm } from "@/src/types";
import { createModelForm } from "../createModelForm";
import { initialSeoForm, toSeoForm } from "./seoForm";

export const { initialForm: initialSectionForm, toForm: toSectionForm } = createModelForm<
    Section,
    SectionForm,
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

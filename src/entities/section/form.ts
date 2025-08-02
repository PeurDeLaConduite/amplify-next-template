import type { ModelForm } from "@/src/utils/createModelForm";
import { type SeoOmit, type Section, toSeoForm } from "@src/entities";
import { createModelForm } from "@utils/createModelForm";
import { initialSeoForm } from "@/src/entities/seo/form";
type PostCustomTypes = { seo: SeoOmit };

export type SectionForm = ModelForm<"Section", "posts", "post", PostCustomTypes, "seo">;
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

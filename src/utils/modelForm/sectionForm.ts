// import { type Section, SectionForm, initialSeoForm, toSeoForm } from "@src/entities";
// import { createModelForm } from "@utils/createModelForm";

// export const { initialForm: initialSectionForm, toForm: toSectionForm } = createModelForm<
//     Section,
//     SectionForm,
//     [string[]]
// >(
//     {
//         slug: "",
//         title: "",
//         description: "",
//         order: 1,
//         seo: { ...initialSeoForm },
//         postIds: [],
//     },
//     (section, postIds: string[] = []) => ({
//         slug: section.slug ?? "",
//         title: section.title ?? "",
//         description: section.description ?? "",
//         order: section.order ?? 1,
//         seo: toSeoForm(section.seo),
//         postIds,
//     })
// );

import type { Section, SectionForm } from "@/src/types";
import { initialSeoForm, toSeoForm } from "./seoForm";

export const initialSectionForm: SectionForm = {
  slug: "",
  title: "",
  description: "",
  order: 1,
  seo: { ...initialSeoForm },
  postIds: [],
};

export function toSectionForm(section: Section, postIds: string[]): SectionForm {
  return {
    slug: section.slug ?? "",
    title: section.title ?? "",
    description: section.description ?? "",
    order: section.order ?? 1,
    seo: toSeoForm(section.seo),
    postIds,
  };
}

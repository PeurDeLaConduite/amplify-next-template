// AUTO-GENERATED – DO NOT EDIT
import type { SectionType, SectionFormType, SectionCreateOmit } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";

import { initialSeoForm, toSeoForm } from "@src/entities/customTypes/seo/form";

export const initialSectionForm: SectionFormType = {
  id: "",
  title: "",
  slug: "",
  description: "",
  order: 0,
  seo: { ...initialSeoForm },
  postIds: [] as string[],
};

function toSectionForm(model: SectionType, postIds: string[] = []): SectionFormType {
  return {
  title: model.title ?? "",
  slug: model.slug ?? "",
  description: model.description ?? "",
  order: model.order ?? 0,
  seo: toSeoForm(model.seo),
  postIds,
  };
}

function toSectionInput(form: SectionFormType): SectionCreateOmit {
  const { postIds, ...rest } = form;
  void postIds;
  return rest as SectionCreateOmit;
}

export const sectionForm = createModelForm<SectionType, SectionFormType, [string[]], SectionCreateOmit>(
  initialSectionForm,
  (model, postIds: string[] = []) => toSectionForm(model, postIds),
  toSectionInput
);

export { toSectionForm, toSectionInput };

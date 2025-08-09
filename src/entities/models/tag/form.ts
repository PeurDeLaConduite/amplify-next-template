// AUTO-GENERATED – DO NOT EDIT
import type { TagType, TagFormType, TagCreateOmit } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialTagForm: TagFormType = {
  id: "",
  name: "",
  postIds: [] as string[],
};

function toTagForm(model: TagType, postIds: string[] = []): TagFormType {
  return {
  name: model.name ?? "",
  postIds,
  };
}

function toTagInput(form: TagFormType): TagCreateOmit {
  const { postIds, ...rest } = form;
  void postIds;
  return rest as TagCreateOmit;
}

export const tagForm = createModelForm<TagType, TagFormType, [string[]], TagCreateOmit>(
  initialTagForm,
  (model, postIds: string[] = []) => toTagForm(model, postIds),
  toTagInput
);

export { toTagForm, toTagInput };

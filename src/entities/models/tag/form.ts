// AUTO-GENERATED – DO NOT EDIT
import type { TagType, TagFormType, TagCreateInput } from "./types";
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

function toTagInput(form: TagFormType): TagCreateInput {
  const { postIds, ...rest } = form;
  void postIds;
  return rest as TagCreateInput;
}

export const tagForm = createModelForm<TagType, TagFormType, [string[]], TagCreateInput>(
  initialTagForm,
  (model, postIds: string[] = []) => toTagForm(model, postIds),
  toTagInput
);

export { toTagForm, toTagInput };

// AUTO-GENERATED – DO NOT EDIT
import type { TagType, TagFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialTagForm: TagFormType = {
  id: "",
  name: "",
  postIds: [] as string[],
};

function toTagForm(model: TagType, postIds: string[] = []): TagFormType {
  return {
  id: model.id ?? "",
  name: model.name ?? "",
  postIds,
  };
}

export const tagForm = createModelForm<TagType, TagFormType, [string[]]>(
  initialTagForm,
  (model, postIds: string[] = []) => toTagForm(model, postIds)
);

export { toTagForm };

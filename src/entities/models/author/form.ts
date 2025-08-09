// AUTO-GENERATED – DO NOT EDIT
import type { AuthorType, AuthorFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialAuthorForm: AuthorFormType = {
  id: "",
  authorName: "",
  bio: "",
  email: "",
  avatar: "",
  order: 0,
};

function toAuthorForm(model: AuthorType): AuthorFormType {
  return {
  id: model.id ?? "",
  authorName: model.authorName ?? "",
  bio: model.bio ?? "",
  email: model.email ?? "",
  avatar: model.avatar ?? "",
  order: model.order ?? 0,
  };
}

export const authorForm = createModelForm<AuthorType, AuthorFormType, []>(
  initialAuthorForm,
  (model) => toAuthorForm(model)
);

export { toAuthorForm };

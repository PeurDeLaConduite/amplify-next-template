// AUTO-GENERATED – DO NOT EDIT
import type { AuthorType, AuthorFormType, AuthorCreateInput } from "./types";
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
  authorName: model.authorName ?? "",
  bio: model.bio ?? "",
  email: model.email ?? "",
  avatar: model.avatar ?? "",
  order: model.order ?? 0,
  };
}

function toAuthorInput(form: AuthorFormType): AuthorCreateInput {
  return form as AuthorCreateInput;
}

export const authorForm = createModelForm<AuthorType, AuthorFormType, [], AuthorCreateInput>(
  initialAuthorForm,
  (model) => toAuthorForm(model),
  toAuthorInput
);

export { toAuthorForm, toAuthorInput };

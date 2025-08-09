// AUTO-GENERATED – DO NOT EDIT
import type { UserNameType, UserNameFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialUserNameForm: UserNameFormType = {
  id: "",
  userName: "",
  owner: "",
};

function toUserNameForm(model: UserNameType): UserNameFormType {
  return {
  id: model.id ?? "",
  userName: model.userName ?? "",
  owner: model.owner ?? "",
  };
}

export const userNameForm = createModelForm<UserNameType, UserNameFormType, []>(
  initialUserNameForm,
  (model) => toUserNameForm(model)
);

export { toUserNameForm };

// AUTO-GENERATED – DO NOT EDIT
import type { UserNameType, UserNameFormType, UserNameCreateInput } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialUserNameForm: UserNameFormType = {
  id: "",
  userName: "",
  owner: "",
};

function toUserNameForm(model: UserNameType): UserNameFormType {
  return {
  userName: model.userName ?? "",
  owner: model.owner ?? "",
  };
}

function toUserNameInput(form: UserNameFormType): UserNameCreateInput {
  return form as UserNameCreateInput;
}

export const userNameForm = createModelForm<UserNameType, UserNameFormType, [], UserNameCreateInput>(
  initialUserNameForm,
  (model) => toUserNameForm(model),
  toUserNameInput
);

export { toUserNameForm, toUserNameInput };

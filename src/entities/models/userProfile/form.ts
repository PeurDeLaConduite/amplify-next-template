// AUTO-GENERATED – DO NOT EDIT
import type { UserProfileType, UserProfileFormType } from "./types";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";


export const initialUserProfileForm: UserProfileFormType = {
  id: "",
  firstName: "",
  familyName: "",
  address: "",
  postalCode: "",
  city: "",
  country: "",
  phoneNumber: "",
};

function toUserProfileForm(model: UserProfileType): UserProfileFormType {
  return {
  id: model.id ?? "",
  firstName: model.firstName ?? "",
  familyName: model.familyName ?? "",
  address: model.address ?? "",
  postalCode: model.postalCode ?? "",
  city: model.city ?? "",
  country: model.country ?? "",
  phoneNumber: model.phoneNumber ?? "",
  };
}

export const userProfileForm = createModelForm<UserProfileType, UserProfileFormType, []>(
  initialUserProfileForm,
  (model) => toUserProfileForm(model)
);

export { toUserProfileForm };

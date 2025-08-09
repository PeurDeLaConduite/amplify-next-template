// AUTO-GENERATED – DO NOT EDIT
    import type { UserProfileType, UserProfileFormType, UserProfileTypeOmit } from "./types";
    import { createModelForm } from "@src/entities/core/createModelForm";
    
    
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
      firstName: model.firstName ?? "",
  familyName: model.familyName ?? "",
  address: model.address ?? "",
  postalCode: model.postalCode ?? "",
  city: model.city ?? "",
  country: model.country ?? "",
  phoneNumber: model.phoneNumber ?? "",
      };
    }
    
    function toUserProfileInput(form: UserProfileFormType): UserProfileTypeOmit {
      return form as UserProfileTypeOmit;
    }
    
    export const userProfileForm = createModelForm<UserProfileType, UserProfileFormType, [], UserProfileTypeOmit>(
      initialUserProfileForm,
      (model) => toUserProfileForm(model),
      toUserProfileInput
    );
    
    export { toUserProfileForm, toUserProfileInput };
    
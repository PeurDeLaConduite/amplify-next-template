// AUTO-GENERATED – DO NOT EDIT
    import type { UserNameType, UserNameFormType, UserNameTypeOmit } from "./types";
    import { createModelForm } from "@src/entities/core/createModelForm";
    
    
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
    
    function toUserNameInput(form: UserNameFormType): UserNameTypeOmit {
      return form as UserNameTypeOmit;
    }
    
    export const userNameForm = createModelForm<UserNameType, UserNameFormType, [], UserNameTypeOmit>(
      initialUserNameForm,
      (model) => toUserNameForm(model),
      toUserNameInput
    );
    
    export { toUserNameForm, toUserNameInput };
    
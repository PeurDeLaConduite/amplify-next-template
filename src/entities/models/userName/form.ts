// AUTO-GENERATED – DO NOT EDIT
import type { UserNameType, UserNameFormType, UserNameTypeOmit } from "./types";
import { createModelForm } from "@src/entities/core";

export const initialUserNameForm: UserNameFormType = {
    id: "",
    userName: "",
};

function toUserNameForm(model: UserNameType): UserNameFormType {
    return {
        userName: model.userName ?? "",
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

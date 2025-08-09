// AUTO-GENERATED – DO NOT EDIT
import type { UserNameType, UserNameFormType, UserNameCreateOmit } from "./types";
import { createModelForm } from "@/src/entities/core/utils/createModelForm";

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

function toUserNameInput(form: UserNameFormType): UserNameCreateOmit {
    return form as UserNameCreateOmit;
}

export const userNameForm = createModelForm<UserNameType, UserNameFormType, [], UserNameCreateOmit>(
    initialUserNameForm,
    (model) => toUserNameForm(model),
    toUserNameInput
);

export { toUserNameForm, toUserNameInput };

import { type UserNameType, type UserNameFormType } from "@src/entities";
import { createModelForm } from "@utils/createModelForm";

export const { initialForm: initialUserNameForm, toForm: toUserNameForm } = createModelForm<
    UserNameType,
    UserNameFormType
>(
    {
        userName: "",
    },
    (userName) => ({
        userName: userName.userName ?? "",
    })
);

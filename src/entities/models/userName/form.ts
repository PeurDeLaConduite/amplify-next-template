import { createModelForm } from "@utils/createModelForm";
import type { UserNameType, UserNameFormType } from "./types";

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

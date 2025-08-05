import {
    type UserNameType,
    type UserNameTypeUpdateInput,
} from "@src/entities";
import { createModelForm } from "@utils/createModelForm";

export const { initialForm: initialUserNameForm, toForm: toUserNameForm } = createModelForm<
    UserNameType,
    UserNameTypeUpdateInput
>(
    {
        userName: "",
    },
    (userName) => ({
        userName: userName.userName ?? "",
    })
);

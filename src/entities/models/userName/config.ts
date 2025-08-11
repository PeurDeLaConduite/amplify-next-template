import { initialUserNameForm, toUserNameForm } from "./form";
import type { UserNameFormType, UserNameTypeUpdateInput } from "./types";

export const userNameConfig = {
    auth: "owner",
    identifier: "id",
    fields: ["userName"],
    relations: ["comments", "postComments"],
    toForm: toUserNameForm,
    toCreate: (form: UserNameFormType): UserNameTypeUpdateInput => ({
        ...form,
    }),
    toUpdate: (form: UserNameFormType): UserNameTypeUpdateInput => ({
        ...form,
    }),
    initialForm: initialUserNameForm,
};

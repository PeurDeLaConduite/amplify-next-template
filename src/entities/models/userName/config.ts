import { initialUserNameForm, toUserNameForm } from "./form";
import type { UserNameFormType, UserNameTypeUpdateInput } from "./types";

export const userNameConfig = {
    auth: "owner",
    identifier: "id",
    fields: ["userName"],
    relations: ["comments", "postComments"],
    toForm: toUserNameForm,
    toCreate: (form: UserNameFormType): UserNameTypeUpdateInput => {
        const { commentsIds, postCommentsIds, ...values } = form;
        void commentsIds;
        void postCommentsIds;
        return values;
    },
    toUpdate: (form: UserNameFormType): UserNameTypeUpdateInput => {
        const { commentsIds, postCommentsIds, ...values } = form;
        void commentsIds;
        void postCommentsIds;
        return values;
    },
    initialForm: initialUserNameForm,
};

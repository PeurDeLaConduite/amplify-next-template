import { createModelForm } from "@src/entities/core";
import type { UserNameType, UserNameFormType } from "./types";

export const { initialForm: initialUserNameForm, toForm: toUserNameForm } = createModelForm<
    UserNameType,
    UserNameFormType,
    [string[], string[]]
>(
    {
        userName: "",
        commentsIds: [],
        postCommentsIds: [],
    },
    (userName, commentsIds: string[] = [], postCommentsIds: string[] = []) => ({
        userName: userName.userName ?? "",
        commentsIds,
        postCommentsIds,
    })
);

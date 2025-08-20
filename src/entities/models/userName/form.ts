import { z, type ZodType } from "zod";
import { createModelForm } from "@entities/core";
import type {
    UserNameType,
    UserNameFormType,
    UserNameTypeCreateInput,
    UserNameTypeUpdateInput,
} from "./types";

export const {
    zodSchema: userNameSchema,
    initialForm: initialUserNameForm,
    toForm: toUserNameForm,
    toCreate: toUserNameCreate,
    toUpdate: toUserNameUpdate,
} = createModelForm<
    UserNameType,
    UserNameFormType,
    UserNameTypeCreateInput,
    UserNameTypeUpdateInput,
    [string[], string[]]
>({
    zodSchema: z.object({
        id: z.string(),
        userName: z.string(),
        commentsIds: z.array(z.string()),
        postCommentsIds: z.array(z.string()),
    }) as ZodType<UserNameFormType>,
    initialForm: {
        id: "",
        userName: "",
        commentsIds: [],
        postCommentsIds: [],
    },
    toForm: (userName, commentsIds: string[] = [], postCommentsIds: string[] = []) => ({
        id: userName.id ?? "",
        userName: userName.userName ?? "",
        commentsIds,
        postCommentsIds,
    }),
    toCreate: (form: UserNameFormType): UserNameTypeCreateInput => {
        const { id, commentsIds, postCommentsIds, ...values } = form;
        void id;
        void commentsIds;
        void postCommentsIds;
        return values;
    },
    toUpdate: (form: UserNameFormType): UserNameTypeUpdateInput => {
        const { id, commentsIds, postCommentsIds, ...values } = form;
        void id;
        void commentsIds;
        void postCommentsIds;
        return values;
    },
});

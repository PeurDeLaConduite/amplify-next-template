import type { UserNameFormType, UserNameTypeUpdateInput } from "@src/entities";

export type UserNameData = UserNameFormType;

export type SingleFieldUserName = {
    field: keyof UserNameFormType;
    value: string;
};

export const normalizeUserName = (d: UserNameTypeUpdateInput = {}): UserNameTypeUpdateInput => ({
    userName: d.userName ?? "",
});

export const fieldLabel = (k: string) =>
    ({
        userName: "Pseudo public",
    })[k] ?? k;

export const userNameLabel = (): string => fieldLabel("userName");

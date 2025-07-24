// src/models/utilsUserName.ts
export type UserNameData = { userName: string };

export type SingleFieldUserName = {
    field: "userName";
    value: string; // jamais null
};

export const normalizeUserName = (d: Partial<UserNameData> = {}): UserNameData => ({
    userName: d.userName ?? "",
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const userNameLabel = (_: "userName"): string => "Pseudo public";

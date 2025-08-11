import { fieldLabel, type MinimalUserName } from "@src/entities/models/userName";

export type SingleFieldUserName = {
    field: keyof MinimalUserName;
    value: MinimalUserName[keyof MinimalUserName];
};

export const normalizeUserName = (d: Partial<MinimalUserName> = {}): MinimalUserName => ({
    userName: d.userName ?? "",
});

export const userNameLabel = (): string => fieldLabel("userName");

export { fieldLabel };

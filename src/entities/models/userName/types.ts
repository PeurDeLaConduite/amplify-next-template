import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@src/entities/core";

export type UserNameType = BaseModel<"UserName">;
export type UserNameTypeOmit = CreateOmit<"UserName">;
export type UserNameTypeUpdateInput = UpdateInput<"UserName">;
export type UserNameFormType = ModelForm<
    "UserName",
    "owner" | "comments" | "postComments",
    "comments" | "postComments"
>;

export type MinimalUserName = {
    userName: string;
};

const labels: Record<keyof MinimalUserName, string> = {
    userName: "Pseudo public",
};

export const fieldLabel = (k: keyof MinimalUserName): string => labels[k];

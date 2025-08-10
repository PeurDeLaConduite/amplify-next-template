import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";

export type UserNameType = BaseModel<"UserName">;
export type UserNameTypeOmit = CreateOmit<"UserName">;
export type UserNameTypeUpdateInput = UpdateInput<"UserName">;
export type UserNameFormType = ModelForm<
    "UserName",
    "owner" | "comments" | "postComments",
    "comments" | "postComments"
>;

import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@myTypes/amplifyBaseTypes";

export type UserProfileType = BaseModel<"UserProfile">;
export type UserProfileTypeOmit = CreateOmit<"UserProfile">;
export type UserProfileTypeUpdateInput = UpdateInput<"UserProfile">;
export type UserProfileFormType = ModelForm<"UserProfile">;

import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@entities/core";

export type UserProfileType = BaseModel<"UserProfile">;
export type UserProfileTypeOmit = CreateOmit<"UserProfile">;
export type UserProfileTypeUpdateInput = UpdateInput<"UserProfile">;
export type UserProfileFormType = ModelForm<"UserProfile">;

import type { BaseModel, CreateOmit, ModelForm } from "@entities/core/types";

export type UserProfileType = BaseModel<"UserProfile">;
export type UserProfileTypeCreateInput = CreateOmit<"UserProfile">;
export type UserProfileTypeUpdateInput = { id: string } & Partial<UserProfileTypeCreateInput>;
export type UserProfileFormType = ModelForm<"UserProfile">;

export type UserProfileMinimalType = {
    firstName: string;
    familyName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phoneNumber: string;
};

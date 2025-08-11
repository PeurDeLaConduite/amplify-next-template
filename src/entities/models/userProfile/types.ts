import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "@src/entities/core";

export type UserProfileType = BaseModel<"UserProfile">;
export type UserProfileTypeOmit = CreateOmit<"UserProfile">;
export type UserProfileTypeUpdateInput = UpdateInput<"UserProfile">;
export type UserProfileFormType = ModelForm<"UserProfile">;

export type MinimalProfile = {
    firstName: string;
    familyName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phoneNumber: string;
};

export const fieldLabel = (field: keyof MinimalProfile): string => {
    switch (field) {
        case "firstName":
            return "Prénom";
        case "familyName":
            return "Nom";
        case "address":
            return "Adresse";
        case "postalCode":
            return "Code postal";
        case "city":
            return "Ville";
        case "country":
            return "Pays";
        case "phoneNumber":
            return "Téléphone";
        default:
            return field;
    }
};

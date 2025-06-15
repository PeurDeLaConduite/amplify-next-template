import type { Schema } from "@/amplify/data/resource";

export type Profile = {
    firstName: string | null;
    familyName: string | null;
    address: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    phoneNumber: string | null;
};
export const label = (field: keyof Profile): string => {
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
type UserProfile = Schema["UserProfile"]["type"];

export type MinimalProfile = Pick<
    UserProfile,
    "firstName" | "familyName" | "address" | "postalCode" | "city" | "country" | "phoneNumber"
>;

export const normalizeFormData = (data: Partial<MinimalProfile>) => ({
    firstName: data.firstName ?? "",
    familyName: data.familyName ?? "",
    address: data.address ?? "",
    postalCode: data.postalCode ?? "",
    city: data.city ?? "",
    country: data.country ?? "",
    phoneNumber: data.phoneNumber ?? "",
});

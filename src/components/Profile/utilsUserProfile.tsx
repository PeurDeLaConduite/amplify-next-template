import { type UserProfileTypeUpdateInput } from "@entities/models/userProfile/types";
export const label = (field: keyof UserProfileTypeUpdateInput): string => {
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

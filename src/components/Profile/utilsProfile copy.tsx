export type Profile = {
    firstName: string | null;
    familyName: string | null;
    address: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    phoneNumber: string | null;
    userName?: string | null; // 👈 Ajout du pseudo public
};

export const label = (field: keyof Profile): string => {
    switch (field) {
        case "userName":
            return "Pseudo public";
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

export type MinimalProfile = {
    firstName: string;
    familyName: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phoneNumber: string;
    userName: string;
};

export const normalizeFormData = (data: Partial<MinimalProfile>) => ({
    userName: data.userName ?? "", // 👈 ici
    firstName: data.firstName ?? "",
    familyName: data.familyName ?? "",
    address: data.address ?? "",
    postalCode: data.postalCode ?? "",
    city: data.city ?? "",
    country: data.country ?? "",
    phoneNumber: data.phoneNumber ?? "",
});

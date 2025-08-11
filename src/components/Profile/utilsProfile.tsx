import { fieldLabel, type MinimalProfile } from "@src/entities/models/userProfile";

export type Profile = {
    firstName: string | null;
    familyName: string | null;
    address: string | null;
    postalCode: string | null;
    city: string | null;
    country: string | null;
    phoneNumber: string | null;
};

export const normalizeFormData = (data: Partial<MinimalProfile>) => ({
    firstName: data.firstName ?? "",
    familyName: data.familyName ?? "",
    address: data.address ?? "",
    postalCode: data.postalCode ?? "",
    city: data.city ?? "",
    country: data.country ?? "",
    phoneNumber: data.phoneNumber ?? "",
});

export { fieldLabel };

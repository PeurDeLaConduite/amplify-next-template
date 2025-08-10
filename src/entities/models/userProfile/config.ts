import { initialUserProfileForm, toUserProfileForm } from "./form";
import type { UserProfileFormType, UserProfileTypeOmit, UserProfileTypeUpdateInput } from "./types";

export const userProfileConfig = {
    auth: "owner",
    identifier: "id",
    fields: ["firstName", "familyName", "address", "postalCode", "city", "country", "phoneNumber"],
    toForm: toUserProfileForm,
    toCreate: (form: UserProfileFormType): UserProfileTypeOmit => ({
        ...form,
    }),
    toUpdate: (form: UserProfileFormType): UserProfileTypeUpdateInput => ({
        ...form,
    }),
    initialForm: initialUserProfileForm,
};

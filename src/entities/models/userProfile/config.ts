import { initialUserProfileForm, toUserProfileForm } from "./form";
import type { UserProfileFormType, UserProfileTypeUpdateInput } from "./types";

export const userProfileConfig = {
    auth: "owner",
    identifier: "id",
    fields: ["firstName", "familyName", "address", "postalCode", "city", "country", "phoneNumber"],
    toForm: toUserProfileForm,
    toCreate: (form: UserProfileFormType): UserProfileTypeUpdateInput => ({
        ...form,
    }),
    toUpdate: (form: UserProfileFormType): UserProfileTypeUpdateInput => ({
        ...form,
    }),
    initialForm: initialUserProfileForm,
};

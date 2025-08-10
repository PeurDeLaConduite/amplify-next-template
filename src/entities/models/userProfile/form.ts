import { createModelForm } from "@entities/core";
import type { UserProfileType, UserProfileFormType } from "./types";

export const { initialForm: initialUserProfileForm, toForm: toUserProfileForm } = createModelForm<
    UserProfileType,
    UserProfileFormType
>(
    {
        firstName: "",
        familyName: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
        phoneNumber: "",
    },
    (profile) => ({
        firstName: profile.firstName ?? "",
        familyName: profile.familyName ?? "",
        address: profile.address ?? "",
        postalCode: profile.postalCode ?? "",
        city: profile.city ?? "",
        country: profile.country ?? "",
        phoneNumber: profile.phoneNumber ?? "",
    })
);

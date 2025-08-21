import { z, type ZodType } from "zod";
import { createModelForm } from "@entities/core";
import type {
    UserProfileType,
    UserProfileFormType,
    UserProfileTypeUpdateInput,
    UserProfileTypeOmit,
} from "./types";

export const {
    zodSchema: userProfileSchema,
    initialForm: initialUserProfileForm,
    toForm: toUserProfileForm,
    toCreate: toUserProfileCreate,
    toUpdate: toUserProfileUpdate,
} = createModelForm<
    UserProfileType,
    UserProfileFormType,
    UserProfileTypeOmit,
    UserProfileTypeUpdateInput
>({
    zodSchema: z.object({
        id: z.string(),
        firstName: z.string(),
        familyName: z.string(),
        address: z.string(),
        postalCode: z.string(),
        city: z.string(),
        country: z.string(),
        phoneNumber: z.string(),
    }) as ZodType<UserProfileFormType>,
    initialForm: {
        id: "",
        firstName: "",
        familyName: "",
        address: "",
        postalCode: "",
        city: "",
        country: "",
        phoneNumber: "",
    },
    toForm: (profile) => ({
        id: profile.id ?? "",
        firstName: profile.firstName ?? "",
        familyName: profile.familyName ?? "",
        address: profile.address ?? "",
        postalCode: profile.postalCode ?? "",
        city: profile.city ?? "",
        country: profile.country ?? "",
        phoneNumber: profile.phoneNumber ?? "",
    }),
    toCreate: (form: UserProfileFormType): UserProfileTypeOmit => ({ ...form }),
    toUpdate: (form: UserProfileFormType): UserProfileTypeUpdateInput => {
        const { id, ...values } = form;
        void id;
        return { ...values };
    },
});

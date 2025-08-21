import { z, type ZodType } from "zod";
import { createModelForm } from "@entities/core";
import type {
    UserProfileType,
    UserProfileFormType,
    UserProfileTypeCreateInput,
    UserProfileTypeUpdateInput,
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
    UserProfileTypeCreateInput,
    UserProfileTypeUpdateInput
>({
    zodSchema: z.object({
        id: z.string().optional(),
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
    toCreate: (form: UserProfileFormType): UserProfileTypeCreateInput => {
        const { id, ...values } = form;
        void id;
        return { ...values };
    },
    toUpdate: (form: UserProfileFormType): UserProfileTypeUpdateInput => {
        const { id, ...values } = form;
        void id;
        return { ...values };
    },
});

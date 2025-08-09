// AUTO-GENERATED – DO NOT EDIT
import type { UserProfileType } from "./types";
import { z } from "zod";

export type UserProfileEditableKeys =
  | "firstName"
  | "familyName"
  | "address"
  | "postalCode"
  | "city"
  | "country"
  | "phoneNumber";

export const userProfileConfig = {
  model: "UserProfile" as const,

  fields: [
    "firstName",
    "familyName",
    "address",
    "postalCode",
    "city",
    "country",
    "phoneNumber"
  ] as UserProfileEditableKeys[],

  labels(field: UserProfileEditableKeys): string {
    switch (field) {
    case "firstName": return "FirstName";
    case "familyName": return "FamilyName";
    case "address": return "Address";
    case "postalCode": return "PostalCode";
    case "city": return "City";
    case "country": return "Country";
    case "phoneNumber": return "PhoneNumber";
      default: return field;
    }
  },

  zodSchema: z.object({
  firstName: z.string().optional(),
  familyName: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  }),

  toInput(form: Partial<Record<UserProfileEditableKeys, unknown>>) {
    const f = form as Partial<Pick<UserProfileType, "firstName" | "familyName" | "address" | "postalCode" | "city" | "country" | "phoneNumber">>;
    const input = {
    firstName: f.firstName,
    familyName: f.familyName,
    address: f.address,
    postalCode: f.postalCode,
    city: f.city,
    country: f.country,
    phoneNumber: f.phoneNumber,
    } satisfies Partial<UserProfileType>;
    return input;
  },

  relations: {
    manyToManyKeys: [] as const
  }
} as const;

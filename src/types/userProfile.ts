import type { Schema } from "@/amplify/data/resource";

export type UserProfile = Schema["UserProfile"]["type"];

export type UserProfileCreateInput = Omit<UserProfile, "id" | "createdAt" | "updatedAt">;

export type UserProfileUpdateInput = Partial<UserProfileCreateInput>;

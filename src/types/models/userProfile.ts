import type { BaseModel, CreateOmit, UpdateInput } from "../amplifyBaseTypes";

export type UserProfile = BaseModel<"UserProfile">;
export type UserProfileOmit = CreateOmit<"UserProfile">;
export type UserProfileUpdateInput = UpdateInput<"UserProfile">;

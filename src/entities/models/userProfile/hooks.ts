// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { UserProfileFormType } from "./types";
import { userProfileConfig } from "./config";
import { userProfileService } from "./service";

export const useUserProfileForm = createEntityHooks<UserProfileFormType>({
    ...userProfileConfig,
    service: userProfileService,
});

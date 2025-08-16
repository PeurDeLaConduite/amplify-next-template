// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import type { UserNameFormType } from "./types";
import { userNameConfig } from "./config";
import { userNameService } from "./service";

export const useUserNameForm = createEntityHooks<UserNameFormType>({
    ...userNameConfig,
    service: userNameService,
});

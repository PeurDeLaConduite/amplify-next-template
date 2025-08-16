// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { PostFormType } from "./types";
import { postConfig } from "./config";
import { postService } from "./service";

export const usePostManager = createEntityHooks<PostFormType>({
    ...postConfig,
    service: postService,
});

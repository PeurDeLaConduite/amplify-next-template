// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { TagFormType } from "./types";
import { tagConfig } from "./config";
import { tagService } from "./service";

export const useTagManager = createEntityHooks<TagFormType>({
    ...tagConfig,
    service: tagService,
});

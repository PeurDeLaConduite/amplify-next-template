import { createEntityHooks } from "@entities/core/factory";
import { tagConfig, type TagExtras } from "./config";
import type { TagFormType, TagType } from "@entities/models/tag/types";

export const useTagForm = createEntityHooks<TagFormType, TagExtras, TagType>(tagConfig);

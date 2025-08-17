import { createEntityHooks } from "@entities/core/factory";
import { sectionConfig, type SectionExtras } from "./config";
import type { SectionFormTypes, SectionTypes } from "@entities/models/section/types";

export const useSectionForm = createEntityHooks<SectionFormTypes, SectionExtras, SectionTypes>(
    sectionConfig
);

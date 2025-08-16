// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { SectionFormType } from "./types";
import { sectionConfig } from "./config";
import { sectionService } from "./service";

export const useSectionManager = createEntityHooks<SectionFormType>({
    ...sectionConfig,
    service: sectionService,
});

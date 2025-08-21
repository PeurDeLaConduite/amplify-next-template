// src/entities/relations/sectionPost/sync.ts
import { createM2MSync } from "@entities/core/utils/createM2MSync";
import { sectionPostService } from "./service";

// sectionPostService doit venir de : relationService("SectionPost", "sectionId", "postId")

export const {
    /** Pour une SECTION donnée, synchroniser ses POSTS */
    syncByParent: syncSection2Posts,
    /** Pour un POST donné, synchroniser ses SECTIONS */
    syncByChild: syncPost2Sections,
} = createM2MSync(sectionPostService);

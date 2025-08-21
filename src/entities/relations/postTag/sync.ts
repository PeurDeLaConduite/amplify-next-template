// src/entities/relations/postTag/sync.ts
import { createM2MSync } from "@entities/core/utils/createM2MSync";
import { postTagService } from "./service";

// postTagService doit venir de:
// relationService("PostTag", "postId", "tagId")

export const {
    /** Pour un TAG donné, synchroniser ses POSTS */
    syncByChild: syncTag2Posts,
    /** Pour un POST donné, synchroniser ses TAGS */
    syncByParent: syncPost2Tags,
} = createM2MSync(postTagService);

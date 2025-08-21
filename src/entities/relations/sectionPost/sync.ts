// src/entities/relations/sectionPost/sync.ts
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { sectionPostService } from "./service";

export async function syncPostSections(postId: string, targetSectionIds: string[]) {
    const currentSectionIds = await sectionPostService.listByChild(postId);
    await syncManyToMany(
        currentSectionIds,
        targetSectionIds,
        (sectionId) => sectionPostService.create(sectionId, postId),
        (sectionId) => sectionPostService.delete(sectionId, postId)
    );
}

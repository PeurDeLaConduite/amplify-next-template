import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { sectionPostService } from "@entities/relations/sectionPost/service";

export async function syncSectionPosts(sectionId: string, targetPostIds: string[]) {
    const currentPostIds = await sectionPostService.listByParent(sectionId);
    await syncManyToMany(
        currentPostIds,
        targetPostIds,
        (postId) => sectionPostService.create(sectionId, postId),
        (postId) => sectionPostService.delete(sectionId, postId)
    );
}

import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { postTagService } from "./service";

export async function syncTagPosts(tagId: string, targetPostIds: string[]) {
    const currentPostIds = await postTagService.listByChild(tagId);
    await syncManyToMany(
        currentPostIds,
        targetPostIds,
        (postId) => postTagService.create(postId, tagId),
        (postId) => postTagService.delete(postId, tagId)
    );
}

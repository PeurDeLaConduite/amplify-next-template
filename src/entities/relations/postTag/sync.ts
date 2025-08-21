// src/entities/relations/postTag/sync.ts
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { postTagService } from "./service";

export async function syncPostTags(postId: string, targetTagIds: string[]) {
    const currentTagIds = await postTagService.listByParent(postId);
    await syncManyToMany(
        currentTagIds,
        targetTagIds,
        (tagId) => postTagService.create(postId, tagId),
        (tagId) => postTagService.delete(postId, tagId)
    );
}

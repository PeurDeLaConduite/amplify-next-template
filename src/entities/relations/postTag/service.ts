import { relationService } from "@src/entities/core/services";

export const postTagService = relationService("PostTag", "postId", "tagId");

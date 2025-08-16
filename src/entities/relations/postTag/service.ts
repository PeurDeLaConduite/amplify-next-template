import { relationService } from "@entities/core";

export const postTagService = relationService("PostTag", "postId", "tagId");

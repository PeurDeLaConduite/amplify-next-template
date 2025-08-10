import { relationService } from "@src/services";

export const postTagService = relationService("PostTag", "postId", "tagId");

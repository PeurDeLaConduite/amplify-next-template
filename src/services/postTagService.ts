// services/postTagService.ts
import { relationService } from "./relationService";

export const postTagService = relationService("PostTag", "postId", "tagId");

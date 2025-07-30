// services/sectionPostService.ts
import { relationService } from "./relationService";

export const sectionPostService = relationService("SectionPost", "sectionId", "postId");

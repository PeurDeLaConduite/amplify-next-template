// services/sectionPostService.ts
import { relationService } from "@services/relationService";

export const sectionPostService = relationService("SectionPost", "sectionId", "postId");

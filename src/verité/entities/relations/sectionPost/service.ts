// services/sectionPostService.ts
import { relationService } from "@/src/entities/core/services/relationService";

export const sectionPostService = relationService("SectionPost", "sectionId", "postId");

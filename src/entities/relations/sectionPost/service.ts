// src/entities/relations/sectionPost/service.ts
import { relationService } from "@src/entities/core/services";

export const sectionPostService = relationService("SectionPost", "sectionId", "postId");

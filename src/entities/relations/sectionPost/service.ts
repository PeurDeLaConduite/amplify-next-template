// src/entities/relations/sectionPost/service.ts
import { relationService } from "@entities/core";

export const sectionPostService = relationService("SectionPost", "sectionId", "postId");

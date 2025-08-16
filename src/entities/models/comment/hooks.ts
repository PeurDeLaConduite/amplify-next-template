// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@entities/core/createEntityHooks";
import type { CommentFormType } from "./types";
import { commentConfig } from "./config";
import { commentService } from "./service";

export const useCommentManager = createEntityHooks<CommentFormType>({
    ...commentConfig,
    service: commentService,
});

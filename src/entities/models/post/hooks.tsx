import { createEntityHooks } from "@entities/core/factory";
import { postConfig, type PostExtras } from "./config";
import type { PostFormType, PostType } from "@entities/models/post/types";

export const usePostForm = createEntityHooks<PostFormType, PostExtras, PostType>(postConfig);

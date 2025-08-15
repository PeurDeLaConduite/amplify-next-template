import { crudService } from "@entities/core";
import type { IdArg } from "@entities/core/types";
import type { PostTypeCreateInput, PostTypeUpdateInput } from "./types";

export const postService = crudService<
    "Post",
    PostTypeCreateInput,
    PostTypeUpdateInput,
    IdArg,
    IdArg
>("Post", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

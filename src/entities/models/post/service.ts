import { crudService } from "@entities/core";
import type { PostTypeOmit, PostTypeUpdateInput } from "@entities/models/post/types";

export const postService = crudService<
    "Post",
    Omit<PostTypeOmit, "comments" | "author" | "sections" | "tags">,
    PostTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Post", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

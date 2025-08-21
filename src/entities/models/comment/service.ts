import { client, crudService } from "@src/entities/core";
import type { CommentTypeCreateInput, CommentTypeUpdateInput } from "./types";

export const commentService = crudService<
    "Comment",
    CommentTypeCreateInput,
    CommentTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Comment", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export function useCommentService() {
    return client.models.Comment;
}

import { client, crudService } from "@src/entities/core";

export const commentService = crudService("Comment", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export function useCommentService() {
    return client.models.Comment;
}

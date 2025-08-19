import { crudService, deleteEdges } from "@entities/core";
import { commentService } from "@entities/models/comment/service";
import { postTagService } from "@entities/relations/postTag/service";
import { sectionPostService } from "@entities/relations/sectionPost/service";
import type { PostTypeOmit, PostTypeUpdateInput } from "@entities/models/post/types";

const base = crudService<
    "Post",
    Omit<PostTypeOmit, "comments" | "author" | "sections" | "tags">,
    PostTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Post", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export const postService = {
    ...base,
    async deleteCascade({ id }: { id: string }) {
        const { data: comments } = await commentService.list({
            filter: { postId: { eq: id } },
        });
        await deleteEdges(comments ?? [], (c) => commentService.delete({ id: c.id }));

        const { data: tagEdges } = await postTagService.list({
            filter: { postId: { eq: id } },
        });
        await deleteEdges(tagEdges ?? [], (edge) => postTagService.delete(edge.postId, edge.tagId));

        const { data: sectionEdges } = await sectionPostService.list({
            filter: { postId: { eq: id } },
        });
        await deleteEdges(sectionEdges ?? [], (edge) =>
            sectionPostService.delete(edge.sectionId, edge.postId)
        );

        return base.delete({ id });
    },
};

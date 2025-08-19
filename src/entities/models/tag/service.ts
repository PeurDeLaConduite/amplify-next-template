import { crudService, deleteEdges } from "@entities/core";
import { postTagService } from "@entities/relations/postTag/service";

const base = crudService("Tag", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export const tagService = {
    ...base,
    async deleteCascade({ id }: { id: string }) {
        await deleteEdges(
            postTagService.list,
            (edge) => postTagService.delete(edge.postId, edge.tagId),
            "tagId",
            id
        );
        return base.delete({ id });
    },
};

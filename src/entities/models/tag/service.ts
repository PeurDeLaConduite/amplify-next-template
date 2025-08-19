import { crudService, deleteEdges } from "@entities/core";
import { postTagService } from "@entities/relations/postTag/service";

const base = crudService("Tag", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export const tagService = {
    ...base,
    async deleteCascade({ id }: { id: string }) {
        const { data: edges } = await postTagService.list({
            filter: { tagId: { eq: id } },
        });
        await deleteEdges(edges ?? [], (edge) => postTagService.delete(edge.postId, edge.tagId));
        return base.delete({ id });
    },
};

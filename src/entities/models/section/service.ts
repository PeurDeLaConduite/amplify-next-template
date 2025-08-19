import { crudService, deleteEdges } from "@entities/core";
import { sectionPostService } from "@entities/relations/sectionPost/service";

const base = crudService("Section", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export const sectionService = {
    ...base,
    async deleteCascade({ id }: { id: string }) {
        const { data: edges } = await sectionPostService.list({
            filter: { sectionId: { eq: id } },
        });
        await deleteEdges(edges ?? [], (edge) =>
            sectionPostService.delete(edge.sectionId, edge.postId)
        );
        return base.delete({ id });
    },
};

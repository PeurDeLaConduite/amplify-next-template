import type { Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";

export const handler: Schema["deleteSectionWithLinks"]["functionHandler"] = async (event) => {
    const { sectionId } = event.arguments;
    const client = generateClient<Schema>();

    // 1. Supprimer tous les SectionPost liés à cette section
    const { data: sectionPosts } = await client.models.SectionPost.list({
        filter: { sectionId: { eq: sectionId } },
        limit: 500,
    });
    if (sectionPosts) {
        for (const sp of sectionPosts) {
            await client.models.SectionPost.delete({
                sectionId: sp.sectionId,
                postId: sp.postId,
            });
        }
    }

    // 2. Supprimer la Section elle-même
    await client.models.Section.delete({ id: sectionId });

    return true;
};

import type { Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";

export const handler: Schema["deletePostWithChildren"]["functionHandler"] = async (event) => {
    const { postId } = event.arguments;
    const client = generateClient<Schema>();

    // 1. Supprimer tous les PostComment liés
    const { data: postComments } = await client.models.PostComment.list({
        filter: { postId: { eq: postId } },
        limit: 500,
    });
    if (postComments) {
        for (const c of postComments) {
            await client.models.PostComment.delete({ id: c.id });
        }
    }

    // 2. Supprimer tous les PostTag liés (identifiant composite)
    const { data: postTags } = await client.models.PostTag.list({
        filter: { postId: { eq: postId } },
        limit: 500,
    });
    if (postTags) {
        for (const pt of postTags) {
            await client.models.PostTag.delete({ postId: pt.postId, tagId: pt.tagId });
        }
    }

    // 3. Supprimer tous les SectionPost liés (identifiant composite)
    const { data: sectionPosts } = await client.models.SectionPost.list({
        filter: { postId: { eq: postId } },
        limit: 500,
    });
    if (sectionPosts) {
        for (const sp of sectionPosts) {
            await client.models.SectionPost.delete({ sectionId: sp.sectionId, postId: sp.postId });
        }
    }

    // 4. Supprimer tous les RelatedPost où postId = postId
    const { data: relatedPosts1 } = await client.models.RelatedPost.list({
        filter: { postId: { eq: postId } },
        limit: 500,
    });
    if (relatedPosts1) {
        for (const rp of relatedPosts1) {
            await client.models.RelatedPost.delete({
                postId: rp.postId,
                relatedPostId: rp.relatedPostId,
            });
        }
    }

    // 5. Supprimer tous les RelatedPost où relatedPostId = postId
    const { data: relatedPosts2 } = await client.models.RelatedPost.list({
        filter: { relatedPostId: { eq: postId } },
        limit: 500,
    });
    if (relatedPosts2) {
        for (const rp of relatedPosts2) {
            await client.models.RelatedPost.delete({
                postId: rp.postId,
                relatedPostId: rp.relatedPostId,
            });
        }
    }

    // 6. (Optionnel) Supprimer tous les Comment liés à ce postId (si tu en as)
    // const { data: comments } = await client.models.Comment.list({
    //   filter: { postId: { eq: postId } },
    //   limit: 500,
    // });
    // if (comments) {
    //   for (const c of comments) {
    //     await client.models.Comment.delete({ id: c.id });
    //   }
    // }

    // 7. Supprimer le Post lui-même
    await client.models.Post.delete({ id: postId });

    return true;
};

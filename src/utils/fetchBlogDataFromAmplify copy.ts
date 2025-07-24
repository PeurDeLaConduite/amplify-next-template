import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import { Schema } from "@/amplify/data/resource";
import type { BlogData } from "@src/types/blog";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export async function fetchBlogDataFromAmplify(): Promise<BlogData> {
    const [postsRes, authorsRes, sectionsRes, sectionPostsRes, postTagsRes] = await Promise.all([
        client.models.Post.list(),
        client.models.Author.list(),
        client.models.Section.list(),
        client.models.SectionPost.list(),
        client.models.PostTag.list(),
    ]);

    const postsData = postsRes.data ?? [];
    const authorsData = authorsRes.data ?? [];
    const sectionsData = sectionsRes.data ?? [];
    const sectionPosts = sectionPostsRes.data ?? [];
    const postTags = postTagsRes.data ?? [];

    const authors = authorsData.map((a) => ({
        authorJsonId: a.id,
        name: a.name ?? "",
        avatar: a.avatar ?? "",
    }));

    const posts = postsData.map((p) => ({
        postJsonId: p.id,
        title: p.title ?? "",
        slug: p.slug ?? "",
        excerpt: p.excerpt ?? "",
        content: p.content ?? "",
        authorJsonId: p.authorId,
        sectionJsonIds: sectionPosts.filter((sp) => sp.postId === p.id).map((sp) => sp.sectionId),
        relatedPostJsonIds: [],
        videoUrl: p.videoUrl ?? null,
        tags: postTags.filter((pt) => pt.postId === p.id).map((pt) => pt.tagId),
        type: p.type ?? "",
        status: p.status ?? "",
        seo: {
            title: p.seo?.title ?? "",
            description: p.seo?.description ?? "",
            image: p.seo?.image ?? null,
        },
        createdAt: (p as { createdAt?: string }).createdAt ?? "",
        updatedAt: (p as { updatedAt?: string }).updatedAt ?? "",
    }));

    const sections = sectionsData.map((s) => ({
        sectionJsonId: s.id,
        title: s.title ?? "",
        slug: s.slug ?? "",
        description: s.description ?? "",
        order: s.order ?? 0,
        postJsonIds: sectionPosts.filter((sp) => sp.sectionId === s.id).map((sp) => sp.postId),
        seo: s.seo
            ? {
                  title: s.seo.title ?? "",
                  description: s.seo.description ?? "",
                  image: s.seo.image ?? undefined,
              }
            : undefined,
    }));

    return { sections, posts, authors };
}

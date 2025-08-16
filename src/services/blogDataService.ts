import { client, canAccess } from "@entities/core";
import type { EntitiesAuthRule } from "@entities/core/types";

import type { BlogData, Author, Post, Section } from "@src/types/blog";

export async function fetchBlogData(): Promise<BlogData> {
    const [authorsRes, sectionsRes, postsRes, tagsRes, postTagsRes, sectionPostsRes] =
        await Promise.all([
            client.models.Author.list({ authMode: "apiKey" }),
            client.models.Section.list({ authMode: "apiKey" }),
            client.models.Post.list({ authMode: "apiKey" }),
            client.models.Tag.list({ authMode: "apiKey" }),
            client.models.PostTag.list({ authMode: "apiKey" }),
            client.models.SectionPost.list({ authMode: "apiKey" }),
        ]);

    const publicRule: EntitiesAuthRule[] = [{ allow: "public" }];

    const authorData = authorsRes.data.filter((a) => canAccess(null, a, publicRule));
    const sectionData = sectionsRes.data.filter((s) => canAccess(null, s, publicRule));
    const postData = postsRes.data.filter((p) => canAccess(null, p, publicRule));

    const tagsById: Record<string, string> = {};
    tagsRes.data.forEach((t) => {
        tagsById[t.id] = t.name;
    });

    const posts: Post[] = postData.map((p) => ({
        postJsonId: p.id,
        title: p.title ?? "",
        slug: p.slug ?? "",
        excerpt: p.excerpt ?? "",
        content: p.content ?? "",
        authorJsonId: p.authorId,
        sectionJsonIds: [],
        relatedPostJsonIds: [],
        videoUrl: p.videoUrl ?? null,
        tags: [],
        type: p.type ?? "",
        status: p.status ?? "",
        seo: {
            title: p.seo?.title ?? "",
            description: p.seo?.description ?? "",
            image: p.seo?.image ?? null,
        },
        createdAt: p.createdAt ?? "",
        updatedAt: p.updatedAt ?? "",
    }));

    const postsById: Record<string, Post> = {};
    posts.forEach((p) => {
        postsById[p.postJsonId] = p;
    });

    const sections: Section[] = sectionData.map((s) => ({
        sectionJsonId: s.id,
        title: s.title ?? "",
        slug: s.slug ?? "",
        description: s.description ?? "",
        order: s.order ?? 0,
        postJsonIds: [],
        seo: s.seo
            ? {
                  title: s.seo.title ?? "",
                  description: s.seo.description ?? "",
                  image: s.seo.image || undefined,
              }
            : undefined,
    }));

    const sectionsById: Record<string, Section> = {};
    sections.forEach((s) => {
        sectionsById[s.sectionJsonId] = s;
    });

    // Map SectionPost relationships
    sectionPostsRes.data.forEach((sp) => {
        const post = postsById[sp.postId];
        if (post) {
            post.sectionJsonIds.push(sp.sectionId);
        }
        const section = sectionsById[sp.sectionId];
        if (section) {
            section.postJsonIds.push(sp.postId);
        }
    });

    // Map PostTag relationships
    postTagsRes.data.forEach((pt) => {
        const post = postsById[pt.postId];
        const tagName = tagsById[pt.tagId];
        if (post && tagName) {
            post.tags.push(tagName);
        }
    });

    const authors: Author[] = authorData.map((a) => ({
        authorJsonId: a.id,
        authorName: a.authorName ?? "",
        avatar: a.avatar ?? "",
    }));

    return { sections, posts, authors };
}

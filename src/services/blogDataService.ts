import { canAccess, type AuthRule } from "@src/entities/core";
import { authorService } from "@src/entities/models/author/service";
import { sectionService } from "@src/entities/models/section/service";
import { postService } from "@src/entities/models/post/service";
import { tagService } from "@src/entities/models/tag/service";
import { postTagService } from "@src/entities/relations/postTag/service";
import { sectionPostService } from "@src/entities/relations/sectionPost/service";

import type { BlogData, Author, Post, Section } from "@src/types/blog";

export async function fetchBlogData(): Promise<BlogData> {
    const [authorsRes, sectionsRes, postsRes, tagsRes, postTagsRes, sectionPostsRes] =
        await Promise.all([
            authorService.list({ authMode: "apiKey" }),
            sectionService.list({ authMode: "apiKey" }),
            postService.list({ authMode: "apiKey" }),
            tagService.list({ authMode: "apiKey" }),
            postTagService.list({ authMode: "apiKey" }),
            sectionPostService.list({ authMode: "apiKey" }),
        ]);

    const publicRule: AuthRule[] = [{ allow: "public" }];

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

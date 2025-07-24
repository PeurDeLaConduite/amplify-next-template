import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";
import type { BlogData, Author, Post, Section } from "@src/types/blog";

//
Amplify.configure(outputs);
// use API key for public server-side calls
const client = generateClient<Schema>({ authMode: "apiKey" });
export async function fetchBlogDataFromAmplify(): Promise<BlogData> {
    const [authorsRes, sectionsRes, postsRes, tagsRes, postTagsRes, sectionPostsRes] =
        await Promise.all([
            client.models.Author.list(),
            client.models.Section.list(),
            client.models.Post.list(),
            client.models.Tag.list(),
            client.models.PostTag.list(),
            client.models.SectionPost.list(),
        ]);

    const tagsById: Record<string, string> = {};
    tagsRes.data.forEach((t) => {
        tagsById[t.id] = t.name;
    });

    const posts: Post[] = postsRes.data.map((p) => ({
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

    const sections: Section[] = sectionsRes.data.map((s) => ({
        sectionJsonId: s.id,
        title: s.title ?? "",
        slug: s.slug ?? "",
        description: s.description ?? "",
        order: s.order ?? 0,
        postJsonIds: [],
        seo: s.seo
            ? {
                  title: s.seo.title,
                  description: s.seo.description,
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

    const authors: Author[] = authorsRes.data.map((a) => ({
        authorJsonId: a.id,
        name: a.name ?? "",
        avatar: a.avatar ?? "",
    }));

    return { sections, posts, authors };
}

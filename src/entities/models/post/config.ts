// AUTO-GENERATED – DO NOT EDIT
import type { PostType } from "./types";
import { z } from "zod";

export type PostEditableKeys =
  | "slug"
  | "title"
  | "excerpt"
  | "content"
  | "videoUrl"
  | "authorId"
  | "order"
  | "type"
  | "status"
  | "seo"
  | "tagIds"
  | "sectionIds";

export const postConfig = {
  model: "Post" as const,

  fields: [
    "slug",
    "title",
    "excerpt",
    "content",
    "videoUrl",
    "authorId",
    "order",
    "type",
    "status",
    "seo",
    "tagIds",
    "sectionIds"
  ] as PostEditableKeys[],

  labels(field: PostEditableKeys): string {
    switch (field) {
    case "slug": return "Slug";
    case "title": return "Title";
    case "excerpt": return "Excerpt";
    case "content": return "Content";
    case "videoUrl": return "VideoUrl";
    case "authorId": return "AuthorId";
    case "order": return "Order";
    case "type": return "Type";
    case "status": return "Status";
    case "seo": return "Seo";
    case "tagIds": return "Tag";
    case "sectionIds": return "Section";
      default: return field;
    }
  },

  zodSchema: z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
  authorId: z.string().min(1),
  order: z.number().optional(),
  type: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  seo: z.any().optional(),
  tagIds: z.array(z.string()),
  sectionIds: z.array(z.string()),
  }),

  toInput(form: Partial<Record<PostEditableKeys, unknown>>) {
    const f = form as Partial<Pick<PostType, "slug" | "title" | "excerpt" | "content" | "videoUrl" | "authorId" | "order" | "type" | "status">>;
    const input = {
    slug: f.slug,
    title: f.title,
    excerpt: f.excerpt,
    content: f.content,
    videoUrl: f.videoUrl,
    authorId: f.authorId,
    order: f.order,
    type: f.type,
    status: f.status,
    } satisfies Partial<PostType>;
    return input;
  },

  relations: {
    manyToManyKeys: ["tag", "section"] as const
  }
} as const;

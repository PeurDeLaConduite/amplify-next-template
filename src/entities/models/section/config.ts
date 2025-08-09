// AUTO-GENERATED – DO NOT EDIT
import type { SectionType } from "./types";
import { z } from "zod";

export type SectionEditableKeys =
  | "title"
  | "slug"
  | "description"
  | "order"
  | "seo"
  | "postIds";

export const sectionConfig = {
  model: "Section" as const,

  fields: [
    "title",
    "slug",
    "description",
    "order",
    "seo",
    "postIds"
  ] as SectionEditableKeys[],

  labels(field: SectionEditableKeys): string {
    switch (field) {
    case "title": return "Title";
    case "slug": return "Slug";
    case "description": return "Description";
    case "order": return "Order";
    case "seo": return "Seo";
    case "postIds": return "Post";
      default: return field;
    }
  },

  zodSchema: z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  order: z.number().optional(),
  seo: z.any().optional(),
  postIds: z.array(z.string()),
  }),

  toInput(form: Partial<Record<SectionEditableKeys, unknown>>) {
    const f = form as Partial<Pick<SectionType, "title" | "slug" | "description" | "order">>;
    const input = {
    title: f.title,
    slug: f.slug,
    description: f.description,
    order: f.order,
    } satisfies Partial<SectionType>;
    return input;
  },

  relations: {
    manyToManyKeys: ["post"] as const
  }
} as const;

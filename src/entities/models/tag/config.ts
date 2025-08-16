// AUTO-GENERATED – DO NOT EDIT
import type { TagType } from "./types";
import { z } from "zod";

export type TagEditableKeys = "name" | "postIds";

export const tagConfig = {
    model: "Tag" as const,

    fields: ["name", "postIds"] as TagEditableKeys[],

    labels(field: TagEditableKeys): string {
        switch (field) {
            case "name":
                return "Name";
            case "postIds":
                return "Post";
            default:
                return field;
        }
    },

    zodSchema: z.object({
        name: z.string().min(1),
        postIds: z.array(z.string()),
    }),

    toInput(form: Partial<Record<TagEditableKeys, unknown>>) {
        const f = form as Partial<Pick<TagType, "name">>;
        const input = {
            name: f.name,
        } satisfies Partial<TagType>;
        return input;
    },

    relations: {
        manyToManyKeys: ["post"] as const,
    },
} as const;

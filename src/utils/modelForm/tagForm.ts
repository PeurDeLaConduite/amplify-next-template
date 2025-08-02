import type { Tag, TagForm } from "@/src/types";
import { createModelForm } from "../createModelForm";

export const { initialForm: initialTagForm, toForm: toTagForm } = createModelForm<
    Tag,
    TagForm,
    [string[]]
>(
    {
        name: "",
        postIds: [],
    },
    (tag, postIds: string[] = []) => ({
        name: tag.name ?? "",
        postIds,
    })
);

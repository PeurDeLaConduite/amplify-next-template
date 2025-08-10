import { createModelForm } from "@src/entities/core";
import { type TagType, type TagFormType } from "@src/entities";

export const { initialForm: initialTagForm, toForm: toTagForm } = createModelForm<
    TagType,
    TagFormType,
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

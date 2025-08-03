import { type ModelForm, createModelForm } from "@/src/utils/createModelForm";
import { type Tag } from "@src/entities";

export type TagForm = ModelForm<"Tag", "posts", "post">;

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

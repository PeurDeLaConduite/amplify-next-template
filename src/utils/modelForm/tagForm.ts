import type { Tag, TagForm } from "@/src/types";

export const initialTagForm: TagForm = {
    name: "",
    postIds: [],
};

export function toTagForm(tag: Tag, postIds: string[]): TagForm {
    return {
        name: tag.name ?? "",
        postIds,
    };
}

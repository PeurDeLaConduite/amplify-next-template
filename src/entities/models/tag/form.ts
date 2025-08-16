// AUTO-GENERATED – DO NOT EDIT
import type { TagType, TagFormType, TagTypeOmit } from "./types";
import { createModelForm } from "@entities/core";

export const initialTagForm: TagFormType = {
    id: "",
    name: "",
    postIds: [] as string[],
};

function toTagForm(model: TagType, postIds: string[] = []): TagFormType {
    return {
        name: model.name ?? "",
        postIds,
    };
}

function toTagInput(form: TagFormType): TagTypeOmit {
    const { postIds, ...rest } = form;
    void postIds;
    return rest as TagTypeOmit;
}

export const tagForm = createModelForm<TagType, TagFormType, [string[]], TagTypeOmit>(
    initialTagForm,
    (model, postIds: string[] = []) => toTagForm(model, postIds),
    toTagInput
);

export { toTagForm, toTagInput };

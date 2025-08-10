import { initialTagForm, toTagForm } from "./form";
import type { TagFormType,  TagTypeUpdateInput } from "./types";

export const tagConfig = {
    auth: "admin",
    identifier: "id",
    fields: ["name"],
    relations: ["posts"],
    toForm: toTagForm,
    toCreate: (form: TagFormType): TagTypeUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    toUpdate: (form: TagFormType): TagTypeUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
    initialForm: initialTagForm,
};

import { z } from "zod";
import { createModelForm } from "@entities/core";
import {
    type TagType,
    type TagFormType,
    type TagTypeUpdateInput,
} from "@entities/models/tag/types";

export const tagSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    postIds: z.array(z.string()),
});

export const {
    initialForm: initialTagForm,
    toForm: toTagForm,
    toCreate: toTagCreate,
    toUpdate: toTagUpdate,
} = createModelForm<TagType, TagFormType, TagTypeUpdateInput, TagTypeUpdateInput, [string[]]>({
    zodSchema: tagSchema,
    initialForm: {
        id: "",
        name: "",
        postIds: [],
    },
    toForm: (tag, postIds: string[] = []) => ({
        id: tag.id ?? "",
        name: tag.name ?? "",
        postIds,
    }),

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
});

import { z } from "zod";
import { createModelForm } from "@entities/core";
import {
    type TagType,
    type TagFormType,
    type TagTypeCreateInput,
    type TagTypeUpdateInput,
} from "@entities/models/tag/types";

export const tagSchema = z.object({
    id: z.string().optional().default(""),
    name: z.string().min(1),
    postIds: z.array(z.string()),
});

export const {
    initialForm: initialTagForm,
    toForm: toTagForm,
    toCreate: toTagCreate,
    toUpdate: toTagUpdate,
} = createModelForm<TagType, TagFormType, TagTypeCreateInput, TagTypeUpdateInput, [string[]]>({
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

    toCreate: (form: TagFormType): TagTypeCreateInput => {
        const { postIds, id: _id, ...values } = form;
        void postIds;
        void _id;
        return values;
    },
    toUpdate: (form: TagFormType): TagTypeUpdateInput => {
        const { postIds, ...values } = form;
        void postIds;
        return values;
    },
});

// src/entities/customTypes/seo/index.ts
import { z, type ZodType } from "zod";
import type { SeoType, SeoFormType, SeoTypeUpdateInput } from "./types";
import { createModelForm } from "@entities/core";

export const {
    zodSchema: seoSchema,
    initialForm: initialSeoForm,
    toForm: toSeoForm,
    toCreate: toSeoCreate,
    toUpdate: toSeoUpdate,
} = createModelForm<SeoType, SeoFormType, SeoTypeUpdateInput, SeoTypeUpdateInput>({
    zodSchema: z.object({
        title: z.string(),
        description: z.string(),
        image: z.string(),
    }) as ZodType<SeoFormType>,
    initialForm: {
        title: "",
        description: "",
        image: "",
    },
    toForm: (seo: SeoType | null | undefined) => ({
        title: seo?.title ?? "",
        description: seo?.description ?? "",
        image: seo?.image ?? "",
    }),
    toCreate: (form: SeoFormType): SeoTypeUpdateInput => {
        return { ...form };
    },
    toUpdate: (form: SeoFormType): SeoTypeUpdateInput => {
        return { ...form };
    },
});

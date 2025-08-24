import { z } from "zod";
import type { OutputData } from "@editorjs/editorjs";
import { client } from "@entities/core/services/amplifyClient";
import { createArticle } from "@/graphql/mutations";

const articleSchema = z.object({
    title: z.string().min(1),
    summary: z.string().optional(),
    content: z.custom<OutputData>(),
    status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const useCreateArticle = () => {
    const createArticleMutation = async (input: z.infer<typeof articleSchema>) => {
        const parsed = articleSchema.parse(input);
        const result = await client.graphql({
            query: createArticle,
            variables: { input: parsed },
            authMode: "userPool",
        });
        return result.data?.createArticle;
    };

    return { createArticle: createArticleMutation };
};

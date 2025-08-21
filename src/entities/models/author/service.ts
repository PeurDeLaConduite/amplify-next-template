import { crudService, setNullBatch } from "@entities/core";
import { postService } from "@entities/models/post/service";
import type { AuthorTypeCreateInput, AuthorTypeUpdateInput } from "@entities/models/author/types";

const base = crudService<
    "Author",
    AuthorTypeCreateInput,
    AuthorTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Author", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export const authorService = {
    ...base,
    async deleteCascade({ id }: { id: string }) {
        await setNullBatch(
            postService.list,
            async (p) => {
                await postService.update({ id: p.id, authorId: null });
            },
            "authorId",
            id
        );
        return base.delete({ id });
    },
};

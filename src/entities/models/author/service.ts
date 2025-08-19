import { crudService, setNullBatch } from "@entities/core";
import { postService } from "@entities/models/post/service";
import type { AuthorTypeOmit, AuthorTypeUpdateInput } from "@entities/models/author/types";

const base = crudService<
    "Author",
    Omit<AuthorTypeOmit, "posts">,
    AuthorTypeUpdateInput & { id: string },
    { id: string },
    { id: string }
>("Author", {
    auth: { read: ["apiKey", "userPool"], write: "userPool" },
});

export const authorService = {
    ...base,
    async deleteCascade({ id }: { id: string }) {
        const { data: posts } = await postService.list({
            filter: { authorId: { eq: id } },
        });
        await setNullBatch(posts ?? [], ["authorId"], (p) =>
            postService.update({ id: p.id, authorId: p.authorId })
        );
        return base.delete({ id });
    },
};

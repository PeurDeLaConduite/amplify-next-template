import type { Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";

export const handler: Schema["deleteTodoWithComments"]["functionHandler"] = async (event) => {
    console.log("Handler deleteTodoWithComments CALLED", event);

    const { todoId } = event.arguments;
    const client = generateClient<Schema>(); // PAS de config ici !!

    const { data: comments } = await client.models.Comment.list({
        filter: { todoId: { eq: todoId } },
        limit: 500,
    });

    if (comments) {
        for (const comment of comments) {
            await client.models.Comment.delete({ id: comment.id });
        }
    }

    await client.models.Todo.delete({ id: todoId });

    return true;
};

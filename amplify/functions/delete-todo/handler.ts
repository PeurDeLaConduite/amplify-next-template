import type { Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";

import { env } from "$amplify/env/delete-todo";

export const handler: Schema["deleteTodoWithComments"]["functionHandler"] = async (event) => {
    // @ts-expect-error - Typage d’env Amplify local juste pour la build, runtime OK cloud
    const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
    Amplify.configure(resourceConfig, libraryOptions);

    const client = generateClient<Schema>();

    console.log("🎯 Handler appelé avec event:", event);

    const { todoId } = event.arguments;

    const { data: comments } = await client.models.Comment.list({
        filter: { todoId: { eq: todoId } },
        limit: 500,
    });

    if (comments) {
        for (const c of comments) {
            await client.models.Comment.delete({ id: c.id });
        }
    }

    await client.models.Todo.delete({ id: todoId });
    return true;
};

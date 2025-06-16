import type { Schema } from "../../data/resource";
import { generateClient } from "aws-amplify/data";

export const handler: Schema["deleteTodoWithComments"]["functionHandler"] = async (event) => {
  const { todoId } = event.arguments;

  const client = generateClient<Schema>({ authMode: "lambda" });

  // 1. Récupérer tous les commentaires du Todo
  const { data: comments } = await client.models.Comment.list({
    filter: { todoId: { eq: todoId } },
    limit: 500, // Pour pagination si > 500 (adapter si besoin)
  });

  // 2. Supprimer chaque commentaire
  if (comments) {
    for (const comment of comments) {
      await client.models.Comment.delete({ id: comment.id });
    }
  }

  // 3. Supprimer le Todo
  await client.models.Todo.delete({ id: todoId });

  return true;
};

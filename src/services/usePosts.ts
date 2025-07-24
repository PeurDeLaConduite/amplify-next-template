import { useCallback } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { Post, PostCreateInput, PostUpdateInput } from "@src/types/post";

const client = generateClient<Schema>();

export function usePosts() {
  const list = useCallback(async (): Promise<Post[]> => {
    const { data } = await client.models.Post.list();
    return data;
  }, []);

  const get = useCallback(async (id: string): Promise<Post | null> => {
    const { data } = await client.models.Post.get({ id });
    return data ?? null;
  }, []);

  const create = useCallback(
    async (input: PostCreateInput): Promise<Post> => {
      const { data } = await client.models.Post.create(input);
      return data;
    },
    []
  );

  const update = useCallback(
    async (id: string, input: PostUpdateInput): Promise<Post> => {
      const { data } = await client.models.Post.update({ id, ...input });
      return data;
    },
    []
  );

  const remove = useCallback(async (id: string): Promise<void> => {
    await client.models.Post.delete({ id });
  }, []);

  return { list, get, create, update, delete: remove };
}

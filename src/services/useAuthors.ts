import { useCallback } from "react";
import { client } from "./amplifyClient";
import type { Author, AuthorOmit, AuthorUpdateInput } from "@/src/types/models/author";

export function useAuthors() {
    const list = useCallback(async (): Promise<Author[]> => {
        const { data } = await client.models.Author.list();
        return data;
    }, []);

    const get = useCallback(async (id: string): Promise<Author | null> => {
        const { data } = await client.models.Author.get({ id });
        return data ?? null;
    }, []);

    const create = useCallback(async (input: AuthorOmit): Promise<Author | null> => {
        const { data } = await client.models.Author.create(input);
        if (!data) {
            return null;
        }
        return data;
    }, []);

    const update = useCallback(
        async (id: string, input: AuthorUpdateInput): Promise<Author | null> => {
            const { data } = await client.models.Author.update({ id, ...input });
            if (!data) {
                return null;
            }
            return data;
        },
        []
    );

    const remove = useCallback(async (id: string): Promise<void> => {
        await client.models.Author.delete({ id });
    }, []);

    return { list, get, create, update, delete: remove };
}
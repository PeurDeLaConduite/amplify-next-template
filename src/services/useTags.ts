import { useCallback } from "react";
import { client } from "./amplifyClient";
import type { Tag, TagOmit, TagUpdateInput } from "@/src/types/models/tag";

export function useTags() {
    const list = useCallback(async (): Promise<Tag[]> => {
        const { data } = await client.models.Tag.list();
        return data;
    }, []);

    const get = useCallback(async (id: string): Promise<Tag | null> => {
        const { data } = await client.models.Tag.get({ id });
        return data ?? null;
    }, []);

    const create = useCallback(async (input: TagOmit): Promise<Tag | null> => {
        const { data } = await client.models.Tag.create(input);
        if (!data) {
            return null;
        }
        return data;
    }, []);

    const update = useCallback(async (id: string, input: TagUpdateInput): Promise<Tag | null> => {
        const { data } = await client.models.Tag.update({ id, ...input });
        if (!data) {
            return null;
        }
        return data;
    }, []);

    const remove = useCallback(async (id: string): Promise<void> => {
        await client.models.Tag.delete({ id });
    }, []);

    return { list, get, create, update, delete: remove };
}

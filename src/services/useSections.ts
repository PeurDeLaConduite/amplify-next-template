import { useCallback } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { Section, SectionCreateInput, SectionUpdateInput } from "@src/types/section";

const client = generateClient<Schema>();

export function useSections() {
    const list = useCallback(async (): Promise<Section[]> => {
        const { data } = await client.models.Section.list();
        return data;
    }, []);

    const get = useCallback(async (id: string): Promise<Section | null> => {
        const { data } = await client.models.Section.get({ id });
        return data ?? null;
    }, []);

    const create = useCallback(async (input: SectionCreateInput): Promise<Section> => {
        const { data } = await client.models.Section.create(input);
        return data;
    }, []);

    const update = useCallback(async (id: string, input: SectionUpdateInput): Promise<Section> => {
        const { data } = await client.models.Section.update({ id, ...input });
        return data;
    }, []);

    const remove = useCallback(async (id: string): Promise<void> => {
        await client.models.Section.delete({ id });
    }, []);

    return { list, get, create, update, delete: remove };
}

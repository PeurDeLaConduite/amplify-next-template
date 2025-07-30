import { useCallback } from "react";
import { client } from "./amplifyClient";
import type { Section, SectionOmit, SectionUpdateInput } from "@/src/types/models/section";

export function useSections() {
    const list = useCallback(async (): Promise<Section[]> => {
        const { data } = await client.models.Section.list();
        return data;
    }, []);

    const get = useCallback(async (id: string): Promise<Section | null> => {
        const { data } = await client.models.Section.get({ id });
        return data ?? null;
    }, []);

    const create = useCallback(async (input: SectionOmit): Promise<Section> => {
        const { data } = await client.models.Section.create(input);
        if (!data) throw new Error("Failed to create section");
        return data;
    }, []);

    const update = useCallback(async (id: string, input: SectionUpdateInput): Promise<Section> => {
        const { data } = await client.models.Section.update({ id, ...input });
        if (!data) throw new Error("Failed to update section");
        return data;
    }, []);

    const remove = useCallback(async (id: string): Promise<void> => {
        await client.models.Section.delete({ id });
    }, []);

    return { list, get, create, update, delete: remove };
}

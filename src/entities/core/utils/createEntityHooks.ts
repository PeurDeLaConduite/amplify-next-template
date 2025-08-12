"use client";

/* src/entities/createEntityHooks.ts  */

import { useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEntityManager, type FieldKey, type FieldConfig } from "@entities/core/hooks";

interface EntityService<T extends Record<string, string>> {
    get: (id: string) => Promise<(T & { id?: string }) | null>;
    create: (id: string, data: T) => Promise<void>;
    update: (id: string, data: Partial<T>) => Promise<void>;
    delete: (id: string) => Promise<void>;
}

export interface CreateEntityHooksConfig<T extends Record<string, string>> {
    model: string;
    fields: FieldKey<T>[];
    labels: (field: FieldKey<T>) => string;
    service: EntityService<T>;
    relations?: unknown;
    customTypes?: unknown;
}

export function createEntityHooks<T extends Record<string, string>>(
    config: CreateEntityHooksConfig<T>
) {
    return function useGeneratedEntityManager() {
        const { user } = useAuthenticator();
        const sub = user?.userId ?? user?.username;
        const [error, setError] = useState<Error | null>(null);

        const fetch = async () => {
            if (!sub) return null;
            try {
                const item = await config.service.get(sub);
                if (!item) return null;
                const data: T & { id?: string } = {
                    id: sub,
                    ...config.fields.reduce((acc, f) => ({ ...acc, [f]: item[f] ?? "" }), {} as T),
                };
                return data;
            } catch (e) {
                setError(e as Error);
                return null;
            }
        };

        const create = async (data: T) => {
            if (!sub) throw new Error("id manquant");
            try {
                setError(null);
                await config.service.create(sub, data);
            } catch (e) {
                setError(e as Error);
            }
        };

        const update = async (_entity: (T & { id?: string }) | null, data: Partial<T>) => {
            void _entity;
            if (!sub) throw new Error("id manquant");
            try {
                setError(null);
                await config.service.update(sub, data);
            } catch (e) {
                setError(e as Error);
            }
        };

        const remove = async (_entity: (T & { id?: string }) | null) => {
            void _entity;
            if (!sub) return;
            try {
                setError(null);
                await config.service.delete(sub);
            } catch (e) {
                setError(e as Error);
            }
        };

        const initialData = config.fields.reduce((acc, f) => ({ ...acc, [f]: "" }), {} as T);

        const fieldConfig: FieldConfig<T> = config.fields.reduce(
            (acc, f) => ({
                ...acc,
                [f]: {
                    parse: (v) => String(v),
                    serialize: (v: string) => v,
                    emptyValue: "",
                },
            }),
            {} as FieldConfig<T>
        );

        const manager = useEntityManager<T>({
            fetch,
            create,
            update,
            remove,
            labels: config.labels,
            fields: config.fields,
            initialData,
            config: fieldConfig,
        });

        return { ...manager, error };
    };
}

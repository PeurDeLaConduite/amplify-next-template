import { useCallback, useMemo, useState } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import useEntityManager, { type FieldKey } from "@src/entities/core/hooks/useEntityManager";

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
        // Compat Amplify v6/v5
        const sub =
            (user as any)?.userId ??
            (user as any)?.username ??
            (user as any)?.attributes?.sub ??
            null;

        const [error, setError] = useState<Error | null>(null);

        const fetch = useCallback(async () => {
            if (!sub) return null;
            try {
                const item = await config.service.get(sub);
                if (!item) return null;

                const data = { id: sub } as T & { id?: string };
                for (const f of config.fields) {
                    // T est Record<string, string>
                    (data as any)[f] = (item as any)[f] ?? "";
                }
                return data;
            } catch (e) {
                setError(e as Error);
                return null;
            }
        }, [config.fields, config.service, sub]);

        const create = useCallback(
            async (data: T) => {
                if (!sub) throw new Error("id manquant");
                try {
                    setError(null);
                    await config.service.create(sub, data);
                } catch (e) {
                    setError(e as Error);
                }
            },
            [config.service, sub]
        );

        const update = useCallback(
            async (_entity: (T & { id?: string }) | null, data: Partial<T>) => {
                void _entity;
                if (!sub) throw new Error("id manquant");
                try {
                    setError(null);
                    await config.service.update(sub, data);
                } catch (e) {
                    setError(e as Error);
                }
            },
            [config.service, sub]
        );

        const remove = useCallback(
            async (_entity: (T & { id?: string }) | null) => {
                void _entity;
                if (!sub) return;
                try {
                    setError(null);
                    await config.service.delete(sub);
                } catch (e) {
                    setError(e as Error);
                }
            },
            [config.service, sub]
        );

        const initialData = useMemo(() => {
            const obj = {} as T;
            for (const f of config.fields) {
                (obj as any)[f] = "";
            }
            return obj;
        }, [config.fields]);

        const manager = useEntityManager<T>({
            fetch,
            create,
            update,
            remove,
            labels: config.labels,
            fields: config.fields,
            initialData,
            // ⚠️ passe une vraie config si ton useEntityManager en attend une
            // config: ...
        });

        return { ...manager, error };
    };
}

// src/entities/core/services/relationService.ts
import { client, Schema } from "./amplifyClient";
import type { AuthMode } from "./crudService";

type AmplifyOpOptions = { authMode?: AuthMode } & Record<string, unknown>;

type ModelKey = keyof typeof client.models;
type BaseModel<K extends ModelKey> = Schema[K]["type"];
type CreateData<K extends ModelKey> = Omit<BaseModel<K>, "id" | "createdAt" | "updatedAt">;

interface RelationCrudModel<K extends ModelKey> {
    create: (
        data: Partial<CreateData<K>>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K> }>;
    delete: (
        where: Partial<CreateData<K>>,
        opts?: AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K> }>;
    list: (
        args?: { filter?: Record<string, unknown> } & AmplifyOpOptions
    ) => Promise<{ data: BaseModel<K>[] }>;
}

function getRelationClient<K extends ModelKey>(key: K): RelationCrudModel<K> {
    return client.models[key] as unknown as RelationCrudModel<K>;
}

// petit utilitaire pour éviter les bursts > limites AppSync
async function inBatches<T>(items: T[], batchSize: number, worker: (chunk: T[]) => Promise<void>) {
    for (let i = 0; i < items.length; i += batchSize) {
        const chunk = items.slice(i, i + batchSize);
        await worker(chunk);
    }
}

export function relationService<
    K extends ModelKey,
    ParentIdKey extends keyof Schema[K]["type"] & string,
    ChildIdKey extends keyof Schema[K]["type"] & string,
>(modelName: K, parentIdKey: ParentIdKey, childIdKey: ChildIdKey) {
    const model = getRelationClient(modelName);

    return {
        async create(parentId: string, childId: string, opts?: AmplifyOpOptions) {
            await model.create(
                {
                    [parentIdKey]: parentId,
                    [childIdKey]: childId,
                } as Partial<CreateData<K>>,
                opts
            );
        },

        async delete(parentId: string, childId: string, opts?: AmplifyOpOptions) {
            await model.delete(
                {
                    [parentIdKey]: parentId,
                    [childIdKey]: childId,
                } as Partial<CreateData<K>>,
                opts
            );
        },

        async list(args?: { filter?: Record<string, unknown> } & AmplifyOpOptions) {
            return model.list(args);
        },

        async listByParent(parentId: string, opts?: AmplifyOpOptions) {
            const { data } = await model.list({
                filter: { [parentIdKey]: { eq: parentId } },
                ...(opts ?? {}),
            });
            return data.map((item) => item[childIdKey]) as string[];
        },

        async listByChild(childId: string, opts?: AmplifyOpOptions) {
            const { data } = await model.list({
                filter: { [childIdKey]: { eq: childId } },
                ...(opts ?? {}),
            });
            return data.map((item) => item[parentIdKey]) as string[];
        },

        /**
         * Idempotent: met à jour les relations pour un parent donné
         * en ajoutant ce qui manque et en supprimant ce qui est en trop.
         */
        async syncForParent(
            parentId: string,
            nextChildIds: string[],
            opts?: AmplifyOpOptions & { batchSize?: number }
        ): Promise<{ added: string[]; removed: string[]; kept: string[] }> {
            const batchSize = opts?.batchSize ?? 20;

            // normalisation basique pour éviter les surprises (espaces/vides/dupli)
            const next = Array.from(
                new Set(nextChildIds.map((s) => s?.trim()).filter(Boolean) as string[])
            );

            const current = await this.listByParent(parentId, opts);
            const currSet = new Set(current);
            const nextSet = new Set(next);

            const toAdd = next.filter((id) => !currSet.has(id));
            const toDel = current.filter((id) => !nextSet.has(id));
            const kept = next.filter((id) => currSet.has(id));

            // Ajouts (en lots)
            await inBatches(toAdd, batchSize, async (chunk) => {
                await Promise.allSettled(
                    chunk.map((childId) =>
                        this.create(parentId, childId, opts).catch((e) => {
                            // en cas de clé composite déjà existante, on ignore
                            if (String(e?.message ?? e).includes("ConditionalCheckFailed")) return;
                            throw e;
                        })
                    )
                );
            });

            // Suppressions (en lots)
            await inBatches(toDel, batchSize, async (chunk) => {
                await Promise.allSettled(
                    chunk.map((childId) => this.delete(parentId, childId, opts))
                );
            });

            return { added: toAdd, removed: toDel, kept };
        },

        /**
         * Variante utilitaire: remplace entièrement l'ensemble (alias pratique)
         */
        async setForParent(
            parentId: string,
            childIds: string[],
            opts?: AmplifyOpOptions & { batchSize?: 20 }
        ) {
            return this.syncForParent(parentId, childIds, opts);
        },
    };
}

// src/entities/core/services/cascade.ts

/**
 * Exécute une fonction asynchrone sur une liste d'éléments avec une limite de concurrence.
 */
export async function withConcurrency<T, R>(
    items: T[],
    concurrency: number,
    worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
    const results: R[] = new Array(items.length);
    let nextIndex = 0;

    async function run(): Promise<void> {
        const current = nextIndex++;
        if (current >= items.length) return;
        results[current] = await worker(items[current], current);
        await run();
    }

    const runners = Array.from({ length: Math.min(concurrency, items.length) }, () => run());
    await Promise.all(runners);
    return results;
}

/**
 * Supprime des "edges" en utilisant une fonction fournie et une concurrence optionnelle.
 */
export async function deleteEdges<T>(
    edges: T[],
    deleter: (edge: T) => Promise<void>,
    concurrency = 10
): Promise<void> {
    await withConcurrency(edges, concurrency, async (edge, _i) => {
        await deleter(edge);
    });
}

/**
 * Met certaines clés à `null` pour chaque élément et exécute une fonction d'update.
 */
export async function setNullBatch<T extends Record<string, any>>(
    items: T[],
    keys: (keyof T)[],
    updater: (item: T) => Promise<void>,
    concurrency = 10
): Promise<void> {
    await withConcurrency(items, concurrency, async (item) => {
        for (const key of keys) {
            (item as any)[key] = null;
        }
        await updater(item);
    });
}

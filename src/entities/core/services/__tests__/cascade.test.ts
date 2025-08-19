import { describe, it, expect } from "vitest";
import { withConcurrency, deleteEdges, setNullBatch } from "@entities/core/services";

function sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

describe("cascade helpers", () => {
    it("withConcurrency limite le nombre de tâches simultanées", async () => {
        let active = 0;
        let max = 0;
        const res = await withConcurrency([1, 2, 3, 4], 2, async (n) => {
            active++;
            max = Math.max(max, active);
            await sleep(10);
            active--;
            return n * 2;
        });
        expect(res).toEqual([2, 4, 6, 8]);
        expect(max).toBeLessThanOrEqual(2);
    });

    it("deleteEdges utilise withConcurrency", async () => {
        const edges = [1, 2, 3];
        const calls: number[] = [];
        await deleteEdges(
            edges,
            async (e) => {
                calls.push(e);
            },
            2
        );
        expect(calls.sort()).toEqual(edges);
    });

    it("setNullBatch met les clés à null et appelle l'updater", async () => {
        const items = [
            { id: 1, ref: 10 },
            { id: 2, ref: 20 },
        ];
        const updated: typeof items = [] as any;
        await setNullBatch(items, ["ref"], async (item) => {
            updated.push({ ...item });
        });
        expect(updated).toEqual([
            { id: 1, ref: null },
            { id: 2, ref: null },
        ]);
    });
});

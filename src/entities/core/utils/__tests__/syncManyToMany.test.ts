import { describe, it, expect, vi } from "vitest";
import { syncManyToMany } from "@entities/core/utils/syncManyToMany";
import { relationService } from "@entities/core/services";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";

vi.mock("@entities/core/services/amplifyClient", () => {
    const mockModel = {
        list: (args?: unknown) =>
            fetch("https://api.test/relation", {
                method: "POST",
                body: JSON.stringify(args),
            }).then((res) => res.json()),
    };
    return { client: { models: { TestRelation: mockModel } } };
});

describe("syncManyToMany", () => {
    it("appelle createFn et deleteFn avec les ID corrects", async () => {
        const createFn = vi.fn().mockResolvedValue(undefined);
        const deleteFn = vi.fn().mockResolvedValue(undefined);
        await syncManyToMany(["1", "2"], ["2", "3"], createFn, deleteFn);
        expect(createFn).toHaveBeenCalledTimes(1);
        expect(createFn).toHaveBeenCalledWith("3");
        expect(deleteFn).toHaveBeenCalledTimes(1);
        expect(deleteFn).toHaveBeenCalledWith("1");
    });

    describe("relationService", () => {
        it("listByParent retourne les IDs enfant", async () => {
            server.use(
                http.post("https://api.test/relation", async ({ request }) => {
                    const body = await request.json();
                    if (body.filter?.parentId?.eq === "p1") {
                        return HttpResponse.json({
                            data: [
                                { parentId: "p1", childId: "c1" },
                                { parentId: "p1", childId: "c2" },
                            ],
                        });
                    }
                    return HttpResponse.json({ data: [] });
                })
            );
            const service = relationService(
                "TestRelation" as any,
                "parentId" as any,
                "childId" as any
            );
            await expect(service.listByParent("p1")).resolves.toEqual(["c1", "c2"]);
        });

        it("listByChild retourne les IDs parent", async () => {
            server.use(
                http.post("https://api.test/relation", async ({ request }) => {
                    const body = await request.json();
                    if (body.filter?.childId?.eq === "c1") {
                        return HttpResponse.json({
                            data: [
                                { parentId: "p1", childId: "c1" },
                                { parentId: "p2", childId: "c1" },
                            ],
                        });
                    }
                    return HttpResponse.json({ data: [] });
                })
            );
            const service = relationService(
                "TestRelation" as any,
                "parentId" as any,
                "childId" as any
            );
            await expect(service.listByChild("c1")).resolves.toEqual(["p1", "p2"]);
        });
    });
});

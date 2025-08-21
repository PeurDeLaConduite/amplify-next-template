import { describe, it, expect, vi } from "vitest";
import type { TagType, TagFormType } from "@entities/models/tag/types";
import { createTagManager } from "@entities/models/tag/manager";

vi.mock("@entities/models/tag/service", () => ({
    tagService: {
        list: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        deleteCascade: vi.fn(),
        get: vi.fn(),
    },
}));

vi.mock("@entities/models/post/service", () => ({
    postService: {
        list: vi.fn(),
    },
}));

vi.mock("@entities/relations/postTag/service", () => ({
    postTagService: {
        listByChild: vi.fn(),
        list: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
    },
}));

import { tagService } from "@entities/models/tag/service";

describe("tag manager", () => {
    it("loadNextPage et loadPrevPage modifient loadingList", async () => {
        const listMock = tagService.list as ReturnType<typeof vi.fn>;
        listMock
            .mockResolvedValueOnce({
                data: [{ id: "t1", name: "Tag1" } as TagType],
                nextToken: "token2",
            })
            .mockResolvedValueOnce({
                data: [{ id: "t2", name: "Tag2" } as TagType],
                nextToken: null,
            })
            .mockResolvedValueOnce({
                data: [{ id: "t1", name: "Tag1" } as TagType],
                nextToken: "token2",
            });

        const manager = createTagManager();
        await manager.refresh();

        const nextPromise = manager.loadNextPage();
        expect(manager.loadingList).toBe(true);
        await nextPromise;
        expect(manager.loadingList).toBe(false);
        expect(manager.entities[0].id).toBe("t2");
        expect(manager.hasPrev).toBe(true);

        const prevPromise = manager.loadPrevPage();
        expect(manager.loadingList).toBe(true);
        await prevPromise;
        expect(manager.loadingList).toBe(false);
        expect(manager.entities[0].id).toBe("t1");
        expect(manager.hasPrev).toBe(false);
    });

    it("validateForm détecte les erreurs et savingCreate reste inchangé", async () => {
        const listMock = tagService.list as ReturnType<typeof vi.fn>;
        listMock.mockResolvedValue({ data: [{ id: "t1", name: "Tag1" } as TagType] });

        const manager = createTagManager();
        expect(manager.savingCreate).toBe(false);

        const result = await manager.validateForm({
            form: { id: "", name: "", postIds: [] } as TagFormType,
        });

        expect(result.valid).toBe(false);
        expect(result.errors.name).toBe("Nom requis");
        expect(manager.savingCreate).toBe(false);
    });

    it("createEntity active puis désactive savingCreate", async () => {
        const listMock = tagService.list as ReturnType<typeof vi.fn>;
        listMock.mockResolvedValue({ data: [] });
        (tagService.create as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: { id: "t3" },
        });

        const manager = createTagManager();

        const promise = manager.createEntity({ id: "", name: "Tag3", postIds: [] });
        expect(manager.savingCreate).toBe(true);
        await promise;
        expect(manager.savingCreate).toBe(false);
    });
});

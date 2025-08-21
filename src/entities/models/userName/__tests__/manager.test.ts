import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserNameManager } from "@entities/models/userName/manager";
import type { UserNameType } from "@entities/models/userName/types";

vi.mock("@entities/models/userName/service", () => ({
    userNameService: {
        list: vi.fn(),
        get: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock("@entities/models/comment/service", () => ({
    commentService: {
        list: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        create: vi.fn(),
    },
}));

import { userNameService } from "@entities/models/userName/service";

describe("userName manager", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("ne fait aucun appel sans editingId", async () => {
        const manager = createUserNameManager();
        await manager.refresh();
        expect(userNameService.get).not.toHaveBeenCalled();
        expect(userNameService.list).not.toHaveBeenCalled();
        expect(manager.entities).toEqual([]);
    });

    it("retourne uniquement l'entrée du sub courant", async () => {
        const manager = createUserNameManager();
        const item = { id: "sub", userName: "John" } as UserNameType;
        (userNameService.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: item });
        manager.enterEdit("sub");
        await manager.refresh();
        expect(userNameService.get).toHaveBeenCalledWith({ id: "sub" });
        expect(userNameService.list).not.toHaveBeenCalled();
        expect(manager.entities).toEqual([item]);
    });
});

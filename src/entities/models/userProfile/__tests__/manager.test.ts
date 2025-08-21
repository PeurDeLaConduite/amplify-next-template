import { describe, it, expect, vi } from "vitest";
import { createUserProfileManager } from "@entities/models/userProfile/manager";

vi.mock("aws-amplify/auth", () => ({
    getCurrentUser: vi.fn().mockResolvedValue({ userId: "sub" }),
}));

vi.mock("@entities/models/userProfile/service", () => ({
    userProfileService: {
        create: vi.fn().mockResolvedValue({}),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

import { userProfileService } from "@entities/models/userProfile/service";

describe("userProfile manager", () => {
    it("crée un profil avec l'id égal au sub", async () => {
        const manager = createUserProfileManager();
        const id = await manager.createEntity({
            id: "",
            firstName: "",
            familyName: "",
            address: "",
            postalCode: "",
            city: "",
            country: "",
            phoneNumber: "",
        });

        expect(id).toBe("sub");
        expect(userProfileService.create).toHaveBeenCalledWith({
            id: "sub",
            firstName: "",
            familyName: "",
            address: "",
            postalCode: "",
            city: "",
            country: "",
            phoneNumber: "",
        });
    });
});

import { test, expect } from "playwright/test";
import { tagService } from "@entities/models/tag/service";
import { email, password, signInUser, signOutUser } from "./utils/auth";

test.describe("Authentification", () => {
    test("apiKey vs userPool", async () => {
        const resApi = await tagService.list({ authMode: "apiKey" });
        expect(Array.isArray(resApi.data)).toBe(true);

        await expect(tagService.create({ name: `e2e-auth-${Date.now()}` })).rejects.toThrow();

        if (email && password) {
            await signInUser();
            const tagName = `e2e-auth-${Date.now()}`;
            const created = await tagService.create({ name: tagName });
            expect(created.data.name).toBe(tagName);
            await tagService.delete({ id: created.data.id });
            await signOutUser();
        }
    });
});

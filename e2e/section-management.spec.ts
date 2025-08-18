import { test, expect } from "playwright/test";
import { sectionService } from "@entities/models/section/service";
import { signInUser, signOutUser, requireCredentials } from "./utils/auth";

test.describe("Section", () => {
    test("création, édition, suppression", async () => {
        requireCredentials();
        await signInUser();

        const slug = `e2e-section-${Date.now()}`;
        const title = `E2E Section ${Date.now()}`;
        const created = await sectionService.create({
            slug,
            title,
            description: "desc",
            order: 1,
        });
        expect(created.data.title).toBe(title);

        const id = created.data.id;
        const updatedTitle = `${title}-updated`;
        const updated = await sectionService.update({ id, title: updatedTitle });
        expect(updated.data.title).toBe(updatedTitle);

        await sectionService.delete({ id });
        await signOutUser();
    });
});

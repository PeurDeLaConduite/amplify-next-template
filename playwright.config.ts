import { defineConfig, devices } from "playwright/test";

export default defineConfig({
    testDir: "./e2e",
    reporter: [["html", { open: "never" }]],
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
        ...devices["Desktop Chrome"],
    },
});

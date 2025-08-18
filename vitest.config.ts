import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text-summary", "cobertura"],
            lines: 100,
            functions: 100,
            branches: 100,
            statements: 100,
        },
    },
    css: {
        postcss: {
            plugins: [],
        },
    },
});

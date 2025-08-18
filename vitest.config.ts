// vitest.config.ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "."),
            "@entities": resolve(__dirname, "src/entities"),
            "@test": resolve(__dirname, "test"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./test/setup.ts"],
        exclude: ["e2e/**"],
        include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        coverage: {
            provider: "v8",
            reporter: ["cobertura", "text-summary"],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["node_modules/", ".next/", "**/*.d.ts", "tests/**", "test/**"],
        },
    },
    css: {
        postcss: { plugins: [] },
    },
});

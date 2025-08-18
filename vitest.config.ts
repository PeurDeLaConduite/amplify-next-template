// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@entities": path.resolve(__dirname, "src/entities"),
            "@": path.resolve(__dirname, "."),
        },
    },
    test: {
        environment: "jsdom",
        // adapte le chemin si besoin
        setupFiles: ["./test/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text-summary", "cobertura"],
            // 👇 les seuils vont ici
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
            // optionnel : choisis ce que tu inclus/exclus
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["node_modules/", ".next/", "**/*.d.ts", "tests/**", "test/**"],
        },
    },
    css: {
        postcss: { plugins: [] },
    },
});

// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
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
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
            "@entities": path.resolve(__dirname, "src/entities"),
        },
    },
    css: {
        postcss: { plugins: [] },
    },
});

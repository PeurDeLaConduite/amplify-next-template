import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
            "@app": path.resolve(__dirname, "app"),
            "@src": path.resolve(__dirname, "src"),
            "@amplify": path.resolve(__dirname, "amplify"),
            "@components": path.resolve(__dirname, "src/components"),
            "@hooks": path.resolve(__dirname, "src/hooks"),
            "@context": path.resolve(__dirname, "src/context"),
            "@utils": path.resolve(__dirname, "src/utils"),
            "@assets": path.resolve(__dirname, "src/assets"),
            "@services": path.resolve(__dirname, "src/services"),
            "@myTypes": path.resolve(__dirname, "src/types"),
            "@entities": path.resolve(__dirname, "src/entities"),
            "@public": path.resolve(__dirname, "public"),
            "@test": path.resolve(__dirname, "tests"),
            tests: path.resolve(__dirname, "tests"),
        },
    },
    test: {
        environment: "jsdom",
        setupFiles: ["./tests/setupTests.ts"],
        exclude: ["**/node_modules/**", "tests/e2e/**"],
    },
});

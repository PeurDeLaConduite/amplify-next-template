require("@rushstack/eslint-patch/modern-module-resolution");
require("ts-node").register({ transpileOnly: true });

module.exports = {
    root: true,
    extends: ["next/core-web-vitals"],
    plugins: ["unused-imports", "import", "internal"],
    parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: __dirname,
    },
    rules: {
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": ["warn", { args: "none" }],
        "import/no-unused-modules": ["warn", { unusedExports: true }],
        "internal/no-onclick-wrapper": "error",
    },
    overrides: [
        {
            files: [
                "app/**/page.{ts,tsx}",
                "app/**/layout.{ts,tsx}",
                "app/**/template.{ts,tsx}",
                "app/**/error.{ts,tsx}",
                "app/**/loading.{ts,tsx}",
                "app/**/not-found.{ts,tsx}",
                "app/**/route.{ts,tsx}",
                "app/**/amplify.{ts,tsx}",
            ],
            rules: { "import/no-unused-modules": "off" },
        },
    ],
};

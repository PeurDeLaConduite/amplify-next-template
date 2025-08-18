// .eslintrc.js
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["next/core-web-vitals"],
    plugins: ["unused-imports", "import"],
    parserOptions: {
        project: ["./tsconfig.json"],
    },
    rules: {
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": ["warn", { args: "none" }],
        "import/no-unused-modules": ["warn", { unusedExports: true }],
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
            ],
            rules: {
                "import/no-unused-modules": "off",
            },
        },
    ],
};

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
};

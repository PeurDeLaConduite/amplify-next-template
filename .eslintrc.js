// .eslintrc.js
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["next/core-web-vitals"],
    parserOptions: {
        project: ["./tsconfig.json"],
    },
    rules: {
        // tes règles custom ici
    },
};

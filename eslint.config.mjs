// eslint.config.mjs
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });
const nextConfigs = compat.extends("next/core-web-vitals", "next/typescript");

// ✅ nomme le tableau avant l'export
const config = [
    { ignores: [".next/**", ".Help/**", "node_modules/**"] },
    ...nextConfigs,
    // (optionnel) désactiver la règle uniquement pour ce fichier de config
    {
        files: ["eslint.config.mjs"],
        rules: { "import/no-anonymous-default-export": "off" },
    },
];

export default config;

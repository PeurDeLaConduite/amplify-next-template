import path from "node:path";
import { ensureDir, safeWrite } from "../utils/fs";
import type { ModelMeta, RelationsMap, Field } from "../types";

const OUT_MODELS = path.join(process.cwd(), "src", "entities", "models");
const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const singular = (s: string) => (s.endsWith("s") ? s.slice(0, -1) : s);

// type guard for custom fields
function isCustomField(f: Field): f is Extract<Field, { kind: "custom" }> {
    return f.kind === "custom";
}

export function renderModel(m: ModelMeta, relations: RelationsMap) {
    const dir = path.join(OUT_MODELS, lower(m.name));
    ensureDir(dir);

    // ---- Champs du form ----
    const simpleFields = m.fields.filter(
        (f) =>
            f.kind === "string" ||
            f.kind === "number" ||
            f.kind === "boolean" ||
            f.kind === "id" ||
            f.kind === "enum"
    );
    const customFields = m.fields.filter(isCustomField);

    // ---- Relations N<->N → *Ids ----
    const rel = relations[m.name] ?? {};
    const manyToMany = Object.entries(rel).flatMap(([relName, def]) =>
        def.kind === "manyToMany" ? [{ relName, child: def.child }] : []
    );

    const relKeysSingular = manyToMany.map((r) => singular(lower(r.child)));
    const relIdsDecl = relKeysSingular.map((k) => `  ${k}Ids: [] as string[],`).join("\n");

    // ---- Imports CT ----
    const ctImports = customFields
        .map((cf) => {
            const ct = cf.refType; // safe due to guard
            const folder = kebab(ct);
            return `import { initial${ct}Form, to${ct}Form } from "@src/entities/customTypes/${folder}/form";`;
        })
        .join("\n");

    // ---- CTMap ----
    const ctMapType = customFields.length
        ? `type CTMap = { ${customFields.map((cf) => `${cf.refType}: ReturnType<typeof to${cf.refType}Form>;`).join(" ")} };`
        : `type CTMap = Record<string, never>;`;

    // ---- RelKeys ----
    const relKeysUnion = relKeysSingular.length
        ? relKeysSingular.map((k) => `"${k}"`).join(" | ")
        : "never";

    // ---- initialForm ----
    const initialLines = simpleFields.map((f) => {
        if (f.kind === "string" || f.kind === "id" || f.kind === "enum") return `  ${f.name}: "",`;
        if (f.kind === "number") return `  ${f.name}: 0,`;
        if (f.kind === "boolean") return `  ${f.name}: false,`;
        return `  ${f.name}: undefined as any,`;
    });

    const initialCustomLines = customFields.map(
        (cf) => `  ${cf.name}: { ...initial${cf.refType}Form },`
    );

    const initialForm = `const initialForm: ${m.name}Form = {
${[...initialLines, ...initialCustomLines, relIdsDecl].filter(Boolean).join("\n")}
};`;

    // ---- toForm ----
    const toFormLines = simpleFields.map((f) => {
        if (f.kind === "string" || f.kind === "id" || f.kind === "enum")
            return `  ${f.name}: model.${f.name} ?? "",`;
        if (f.kind === "number") return `  ${f.name}: model.${f.name} ?? 0,`;
        if (f.kind === "boolean") return `  ${f.name}: model.${f.name} ?? false,`;
        return `  ${f.name}: model.${f.name} as any,`;
    });

    const toFormCustomLines = customFields.map(
        (cf) => `  ${cf.name}: to${cf.refType}Form(model.${cf.name}),`
    );

    const argsTupleType = manyToMany.length
        ? `[${manyToMany.map(() => "string[]").join(", ")}]`
        : "[]";
    const toFormArgs = manyToMany.map((_, i) => `${relKeysSingular[i]}Ids = []`).join(", ");
    const toFormReturnRelIds = manyToMany.map((_, i) => `  ${relKeysSingular[i]}Ids,`).join("\n");

    const formTs = `// AUTO-GENERATED – DO NOT EDIT
import type { Schema } from "@/amplify/data/resource";
import { type ModelForm, createModelForm } from "@src/entities/core/createModelForm";

import { ${lower(m.name)}Config } from "./config";
${ctImports ? "\n" + ctImports : ""}

// ---- Types ----
${customFields.length ? ctMapType : "type CTMap = Record<string, never>;"}
type RelKeys = ${relKeysUnion};

export type ${m.name}Form = ModelForm<
  "${m.name}",
  never,          // Omit (si besoin)
  RelKeys,        // relations N<->N
  CTMap,          // mapping des custom types
  ${customFields.length ? customFields.map((cf) => `"${cf.refType}"`).join(" | ") : "never"}
>;

// ---- initial & toForm ----
${initialForm}

function toForm(model: Schema["${m.name}"]${manyToMany.length ? ", " + toFormArgs : ""}): ${m.name}Form {
  return {
${[...toFormLines, ...toFormCustomLines, toFormReturnRelIds].filter(Boolean).join("\n")}
  };
}

export const ${lower(m.name)}Form = createModelForm<Schema["${m.name}"], ${m.name}Form, ${argsTupleType}>(
  initialForm,
  (model${manyToMany.length ? ", " + manyToMany.map((_, i) => `${relKeysSingular[i]}Ids: string[] = []`).join(", ") : ""}) =>
    toForm(model${manyToMany.length ? ", " + relKeysSingular.map((k) => `${k}Ids`).join(", ") : ""})
);

export const { initialForm: initial${m.name}Form, toForm: to${m.name}Form } = ${lower(m.name)}Form;
`;

    // files
    safeWrite(path.join(dir, "form.ts"), formTs);

    const serviceTs = `// AUTO-GENERATED – DO NOT EDIT
import { crudService } from "@src/entities/core/services/crudService";
export const ${lower(m.name)}Service = crudService("${m.name}");
`;
    safeWrite(path.join(dir, "service.ts"), serviceTs);

    const hooksTs = `// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import { ${lower(m.name)}Config } from "./config";
export const { useManager: use${m.name}Manager, service: ${lower(m.name)}Service2, form: ${lower(m.name)}Form2 } =
  createEntityHooks(${lower(m.name)}Config);
`;
    safeWrite(path.join(dir, "hooks.ts"), hooksTs);

    const indexTs = `// AUTO-GENERATED – DO NOT EDIT
export * from "./config";
export * from "./service";
export * from "./form";
export * from "./hooks";
`;
    safeWrite(path.join(dir, "index.ts"), indexTs);
}

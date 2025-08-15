import path from "node:path";
import { modelOutDir, isCustomField, safeWrite } from "./common";
import type { ModelMeta, RelationsMap, Field } from "../types";

function zExpr(f: Field): string {
    if (f.kind === "string") return f.required ? "z.string().min(1)" : "z.string().optional()";
    if (f.kind === "number") return f.required ? "z.number()" : "z.number().optional()";
    if (f.kind === "boolean") return f.required ? "z.boolean()" : "z.boolean().optional()";
    if (f.kind === "enum") {
        // @ts-ignore
        const vals = (f.enumValues ?? []).map((v: string) => JSON.stringify(v)).join(", ");
        return f.required ? `z.enum([${vals}])` : `z.enum([${vals}]).optional()`;
    }
    if (f.kind === "id") return f.required ? "z.string().min(1)" : "z.string().optional()";
    if (f.kind === "custom") return f.required ? "z.any()" : "z.any().optional()";
    return "z.any().optional()";
}

export function renderModelConfig(m: ModelMeta, relations: RelationsMap) {
    const dir = modelOutDir(m.name);

    const rel = relations[m.name] ?? {};
    const manyToMany = Object.values(rel).filter((d: any) => d.kind === "manyToMany") as any[];
    const relKeysSingular = manyToMany.map((d) =>
        (d.child.charAt(0).toLowerCase() + d.child.slice(1)).replace(/s$/, "")
    );

    const simple = m.fields.filter((f) =>
        ["string", "number", "boolean", "id", "enum"].includes((f as any).kind)
    );
    const custom = m.fields.filter(isCustomField);

    const omit = new Set(["id", "owner", "createdAt", "updatedAt"]);
    const editableSimple = (simple as any[]).filter((f) => !omit.has(f.name));

    const zodLines = [
        ...editableSimple.map((f: any) => `  ${f.name}: ${zExpr(f)},`),
        ...custom.map((cf) => `  ${cf.name}: z.any().optional(),`),
        ...relKeysSingular.map((k) => `  ${k}Ids: z.array(z.string()),`),
    ];

    const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const labelsLines = [
        ...editableSimple.map((f: any) => `    case "${f.name}": return "${label(f.name)}";`),
        ...custom.map((cf) => `    case "${cf.name}": return "${label(cf.name)}";`),
        ...relKeysSingular.map((k) => `    case "${k}Ids": return "${label(k)}";`),
    ];

    const pickLiteral = editableSimple.length
        ? editableSimple.map((f: any) => `"${f.name}"`).join(" | ")
        : "never";
    const mapLines = editableSimple.map((f: any) => `    ${f.name}: f.${f.name},`).join("\n");
    const fieldsArr = [
        ...editableSimple.map((f: any) => `    "${f.name}"`),
        ...custom.map((cf) => `    "${cf.name}"`),
        ...relKeysSingular.map((k) => `    "${k}Ids"`),
    ].join(",\n");

    const low = m.name[0].toLowerCase() + m.name.slice(1);

    const content = `// AUTO-GENERATED – DO NOT EDIT
import type { ${m.name}Type } from "./types";
import { z } from "zod";

export type ${m.name}EditableKeys =
${(editableSimple.length ? editableSimple.map((f: any) => `  | "${f.name}"`).join("\n") : "  never") + (custom.length ? "\n" + custom.map((cf) => `  | "${cf.name}"`).join("\n") : "") + (relKeysSingular.length ? "\n" + relKeysSingular.map((k) => `  | "${k}Ids"`).join("\n") : "")};

export const ${low}Config = {
  model: "${m.name}" as const,

  fields: [
${fieldsArr}
  ] as ${m.name}EditableKeys[],

  labels(field: ${m.name}EditableKeys): string {
    switch (field) {
${labelsLines.join("\n")}
      default: return field;
    }
  },

  zodSchema: z.object({
${zodLines.join("\n")}
  }),

  toInput(form: Partial<Record<${m.name}EditableKeys, unknown>>) {
    const f = form as Partial<Pick<${m.name}Type, ${pickLiteral}>>;
    const input = {
${mapLines}
    } satisfies Partial<${m.name}Type>;
    return input;
  },

  relations: {
    manyToManyKeys: [${relKeysSingular.map((k) => `"${k}"`).join(", ")}] as const
  }
} as const;
`;

    safeWrite(path.join(dir, "config.ts"), content);
}

import path from "node:path";
import { modelOutDir, isCustomField, singular, safeWrite, GEN, kebab } from "./common";
import type { ModelMeta, RelationsMap } from "../types";

export function renderModelTypes(m: ModelMeta, relations: RelationsMap) {
  const dir = modelOutDir(m.name);

  const rel = relations[m.name] ?? {};
  const manyToMany = Object.values(rel).filter((d: any) => d.kind === "manyToMany") as any[];
  const relKeysSingular = manyToMany.map((d) => (d.child.charAt(0).toLowerCase() + d.child.slice(1)).replace(/s$/, ""));
  const relUnion = relKeysSingular.length ? relKeysSingular.map((k) => `"${k}"`).join(" | ") : "never";

  const custom = m.fields.filter(isCustomField);
  const ctUnion = custom.length ? custom.map((cf) => `"${cf.refType}"`).join(" | ") : "never";
  const ctImports = custom.map((cf) => `import type { ${cf.refType}Form } from "${GEN.paths.customTypeFormDir(cf.refType)}";`).join("\n");
  const ctMap = custom.length ? `type CTMap = { ${custom.map((cf) => `${cf.refType}: ${cf.refType}Form`).join("; ")} };` : `type CTMap = Record<string, never>;`;

  const content = `// AUTO-GENERATED – DO NOT EDIT
import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "${GEN.paths.myTypes}";
${ctImports ? "\n" + ctImports : ""}

export type ${m.name}Type = BaseModel<"${m.name}">;
export type ${m.name}TypeOmit = CreateOmit<"${m.name}">;
export type ${m.name}TypeUpdateInput = UpdateInput<"${m.name}">;

${ctMap}
type RelKeys = ${relUnion};

export type ${m.name}FormType = ModelForm<
  "${m.name}",
  never,
  RelKeys,
  CTMap,
  ${ctUnion}
>;
`;
  safeWrite(path.join(dir, "types.ts"), content);
}


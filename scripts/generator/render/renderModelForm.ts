import path from "node:path";
import { modelOutDir, isCustomField, safeWrite, GEN } from "./common";
import type { ModelMeta, RelationsMap } from "../types";

export function renderModelForm(m: ModelMeta, relations: RelationsMap) {
    const dir = modelOutDir(m.name);

    const simple = m.fields.filter((f) =>
        ["string", "number", "boolean", "id", "enum"].includes((f as any).kind)
    );
    const custom = m.fields.filter(isCustomField);
    const rel = relations[m.name] ?? {};
    const manyToMany = Object.values(rel).filter((d: any) => d.kind === "manyToMany") as any[];
    const relKeysSingular = manyToMany.map((d) =>
        (d.child.charAt(0).toLowerCase() + d.child.slice(1)).replace(/s$/, "")
    );

    const ctImports = custom
        .map(
            (cf) =>
                `import { initial${cf.refType}Form, to${cf.refType}Form, to${cf.refType}Input } from "${GEN.paths.customTypeFormDir(cf.refType)}";`
        )
        .join("\n");

    const initLines: string[] = [];
    if (GEN.rules.includeIdInForm) initLines.push(`  id: "",`);
    for (const f of simple) {
        const name = (f as any).name;
        const kind = (f as any).kind;
        if (name === "id" && GEN.rules.includeIdInForm) continue;
        if (kind === "string" || kind === "id" || kind === "enum") initLines.push(`  ${name}: "",`);
        else if (kind === "number") initLines.push(`  ${name}: 0,`);
        else if (kind === "boolean") initLines.push(`  ${name}: false,`);
    }
    for (const cf of custom) initLines.push(`  ${cf.name}: { ...initial${cf.refType}Form },`);
    for (const k of relKeysSingular) initLines.push(`  ${k}Ids: [] as string[],`);

    const toFormLines: string[] = [];
    if (GEN.rules.includeIdInForm) toFormLines.push(`  id: model.id ?? "",`);
    for (const f of simple) {
        const name = (f as any).name;
        const kind = (f as any).kind;
        if (name === "id") continue;
        if (kind === "string" || kind === "id" || kind === "enum")
            toFormLines.push(`  ${name}: model.${name} ?? "",`);
        else if (kind === "number") toFormLines.push(`  ${name}: model.${name} ?? 0,`);
        else if (kind === "boolean") toFormLines.push(`  ${name}: model.${name} ?? false,`);
    }
    for (const cf of custom)
        toFormLines.push(`  ${cf.name}: to${cf.refType}Form(model.${cf.name}),`);
    for (const k of relKeysSingular) toFormLines.push(`  ${k}Ids,`);

    const argsTupleType = manyToMany.length
        ? `[${manyToMany.map(() => "string[]").join(", ")}]`
        : "[]";
    const argsDecl = manyToMany.length
        ? ", " + relKeysSingular.map((k) => `${k}Ids: string[] = []`).join(", ")
        : "";
    const argsCall = manyToMany.length
        ? ", " + relKeysSingular.map((k) => `${k}Ids`).join(", ")
        : "";

    const low = m.name[0].toLowerCase() + m.name.slice(1);

    const content = `// AUTO-GENERATED – DO NOT EDIT
    import type { ${m.name}Type, ${m.name}FormType, ${m.name}TypeOmit } from "./types";
    import { createModelForm } from "${GEN.paths.createModelForm}";
    ${ctImports ? "\n" + ctImports : ""}
    
    export const initial${m.name}Form: ${m.name}FormType = {
    ${initLines.join("\n")}
    };
    
    function to${m.name}Form(model: ${m.name}Type${argsDecl}): ${m.name}FormType {
      return {
    ${toFormLines.join("\n")}
      };
    }
    
    function to${m.name}Input(form: ${m.name}FormType): ${m.name}TypeOmit {
    ${(() => {
        const vars: string[] = [];
        if (GEN.rules.includeIdInForm) vars.push("id");
        for (const k of relKeysSingular) vars.push(`${k}Ids`);
        if (vars.length) {
            const destruct = vars.join(", ");
            const voidLines = vars.map((v) => `  void ${v};`).join("\n");
            return `  const { ${destruct}, ...rest } = form;\n${voidLines}\n  return rest as ${m.name}TypeOmit;`;
        }
        return `  return form as ${m.name}TypeOmit;`;
    })()}
    }
    
    export const ${low}Form = createModelForm<${m.name}Type, ${m.name}FormType, ${argsTupleType}, ${m.name}TypeOmit>(
      initial${m.name}Form,
      (model${argsDecl}) => to${m.name}Form(model${argsCall}),
      to${m.name}Input
    );
    
    export { to${m.name}Form, to${m.name}Input };
    `;
    safeWrite(path.join(dir, "form.ts"), content);
}

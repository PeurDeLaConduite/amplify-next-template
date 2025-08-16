// scripts/generate-from-resource.ts
import path from "node:path";
import fs from "node:fs";
import { Project, Node, ObjectLiteralExpression, CallExpression } from "ts-morph";

const ROOT = path.resolve(process.cwd());
const RESOURCE = path.join(ROOT, "amplify", "data", "resource.ts");
const OUT_INTROSPECTION = path.join(ROOT, "src", "entities", "introspection");
const OUT_MODELS = path.join(ROOT, "src", "entities", "models");
const OUT_RELATIONS = path.join(ROOT, "src", "entities", "relations");

type Assoc =
    | { kind: "hasMany"; target: string; targetFk: string }
    | { kind: "belongsTo"; target: string; fk: string };

type Field =
    | {
          name: string;
          kind: "string" | "number" | "boolean" | "enum" | "custom" | "id";
          enumValues?: string[];
          refType?: string;
      }
    | { name: string; kind: "unknown" };

type ModelMeta = {
    name: string;
    type: "model" | "customType";
    fields: Field[];
    assocs: Assoc[];
    identifier?: string[];
};

type RelationDef =
    | { kind: "hasMany"; child: string; childFk: string }
    | { kind: "manyToMany"; through: string; parentKey: string; childKey: string; child: string };
function getBaseCall(call: CallExpression): CallExpression {
    // remonte à l'appel interne "a.model(...)" ou "a.customType(...)"
    let curr: CallExpression = call;
    // tant que l'expression est un PropertyAccess (xxx.yyy) ET que l'objet de ce PA est un CallExpression, on "descend" dedans
    // ex: (a.model({...})).authorization(...) -> base = a.model({...})
    while (true) {
        const expr = curr.getExpression();
        if (Node.isPropertyAccessExpression(expr)) {
            const inner = expr.getExpression();
            if (Node.isCallExpression(inner)) {
                curr = inner; // descend jusqu'à la base
                continue;
            }
        }
        break;
    }
    return curr;
}
// Résout l'initializer réel même si c'est un identifiant (ex: Todo: todoModel)
function resolveCallFromInitializer(init: Node): CallExpression | null {
    if (Node.isCallExpression(init)) return init;
    if (Node.isIdentifier(init)) {
        const decl = init.getSymbol()?.getDeclarations()?.[0];
        if (!decl) return null;
        // variables: const todoModel = a.model(...).authorization(...)
        if ("getInitializer" in decl) {
            // @ts-ignore - ts-morph typeguard light
            const dInit = decl.getInitializer?.();
            if (Node.isCallExpression(dInit)) return dInit;
        }
    }
    return null;
}

function getBaseCalleeName(call: CallExpression): string {
    const expr = getBaseCall(call).getExpression();
    if (Node.isPropertyAccessExpression(expr)) {
        const left = expr.getExpression().getText().replace(/\s+/g, ""); // "a"
        const right = expr.getName(); // "model" | "customType"
        return `${left}.${right}`; // "a.model" | "a.customType"
    }
    return expr.getText().replace(/\s+/g, "");
}
function ensureDir(p: string) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeJSON(p: string, v: unknown) {
    ensureDir(path.dirname(p));
    fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", "utf8");
}

function safeWrite(p: string, content: string) {
    if (!fs.existsSync(p)) {
        ensureDir(path.dirname(p));
        fs.writeFileSync(p, content, "utf8");
        console.log("✔ created", path.relative(ROOT, p));
    } else {
        console.log("• exists ", path.relative(ROOT, p));
    }
}

function isCallTo(node: Node | undefined, name: string) {
    if (!node || !Node.isCallExpression(node)) return false;
    const exp = node.getExpression();
    return exp.getText() === name;
}

function asString(node: Node | undefined): string | undefined {
    if (!node) return;
    if (Node.isStringLiteral(node)) return node.getLiteralText();
    return undefined;
}

function findSchemaObjectLiteral(resourceAbsPath: string): ObjectLiteralExpression | null {
    const project = new Project({
        tsConfigFilePath: path.join(ROOT, "tsconfig.json"),
        skipAddingFilesFromTsConfig: true,
    });
    project.addSourceFileAtPath(resourceAbsPath);

    const sf = project.getSourceFileOrThrow(resourceAbsPath);
    // cherche `const schema = a.schema({ ... })`
    const decl = sf.getVariableDeclarationOrThrow("schema");
    const init = decl.getInitializerOrThrow();

    if (!Node.isCallExpression(init)) {
        throw new Error("schema n'est pas un CallExpression");
    }
    if (init.getExpression().getText() !== "a.schema") {
        throw new Error("schema n'est pas initialisé via a.schema(...)");
    }
    const arg = init.getArguments()[0];
    if (!Node.isObjectLiteralExpression(arg)) {
        throw new Error("a.schema(...) n'a pas un objet en 1er argument");
    }
    return arg;
}
function hasRequired(call: CallExpression): boolean {
    // détecte a.xxx().required()
    let curr: Node = call;
    while (curr.getParent() && Node.isCallExpression(curr.getParent()!)) {
        const parent = curr.getParent() as CallExpression;
        const expr = parent.getExpression().getText();
        if (expr.endsWith(".required")) return true;
        curr = parent;
    }
    return false;
}

function parseModelObject(name: string, call: CallExpression): ModelMeta {
    // call peut être a.model(...).authorization(...).identifier(...)
    const base = getBaseCall(call);

    // 1) on lit les CHAMPS sur la base a.model({...})
    const modelArg = base.getArguments()[0];
    let fieldsArg: ObjectLiteralExpression | null = null;
    if (Node.isObjectLiteralExpression(modelArg)) fieldsArg = modelArg;

    // 2) on lit la CHAÎNE PARENTE pour récupérer identifier([...])
    let identifier: string[] | undefined;
    const chain = collectChainedCalls(base); // <— important: partir de "base"
    for (const c of chain) {
        const exprText = c.getExpression().getText();
        if (exprText.endsWith(".identifier")) {
            const arr = c.getArguments()[0];
            if (Node.isArrayLiteralExpression(arr)) {
                identifier = arr.getElements().map((e) => e.getText().replace(/["'`]/g, ""));
            }
        }
    }

    const fields: Field[] = [];
    const assocs: Assoc[] = [];

    if (fieldsArg) {
        for (const prop of fieldsArg.getProperties()) {
            if (!Node.isPropertyAssignment(prop)) continue;
            const key = prop.getName();
            const init = prop.getInitializer();

            if (!init || !Node.isCallExpression(init)) {
                fields.push({ name: key, kind: "unknown" });
                continue;
            }

            // !!! on regarde le callee de BASE ici aussi (un champ peut être a.string().required())
            const fieldBase = getBaseCall(init);
            const callee = fieldBase.getExpression().getText();

            // Associations
            if (callee === "a.hasMany") {
                const target = asString(fieldBase.getArguments()[0]);
                const fk = asString(fieldBase.getArguments()[1]);
                if (target && fk) assocs.push({ kind: "hasMany", target, targetFk: fk });
                continue;
            }
            if (callee === "a.belongsTo") {
                const target = asString(fieldBase.getArguments()[0]);
                const fk = asString(fieldBase.getArguments()[1]);
                if (target && fk) assocs.push({ kind: "belongsTo", target, fk });
                continue;
            }

            // Champs simples (+ required via la chaîne)
            const required = hasRequired(init); // réutilise ton helper
            if (callee === "a.string") {
                fields.push({ name: key, kind: "string", required });
                continue;
            }
            if (callee === "a.integer" || callee === "a.float" || callee === "a.number") {
                fields.push({ name: key, kind: "number", required });
                continue;
            }
            if (callee === "a.boolean") {
                fields.push({ name: key, kind: "boolean", required });
                continue;
            }
            if (callee === "a.id") {
                fields.push({ name: key, kind: "id", required });
                continue;
            }
            if (callee === "a.enum") {
                const arg0 = fieldBase.getArguments()[0];
                let enumValues: string[] | undefined;
                if (Node.isArrayLiteralExpression(arg0)) {
                    enumValues = arg0.getElements().map((e) => e.getText().replace(/["'`]/g, ""));
                }
                fields.push({ name: key, kind: "enum", enumValues, required });
                continue;
            }
            if (callee === "a.ref") {
                const ref = asString(fieldBase.getArguments()[0]);
                fields.push({ name: key, kind: "custom", refType: ref, required });
                continue;
            }

            fields.push({ name: key, kind: "unknown" });
        }
    }

    return { name, type: "model", fields, assocs, identifier };
}

function collectChainedCalls(call: CallExpression): CallExpression[] {
    // a.model({...}).authorization(...).identifier([...])
    const out: CallExpression[] = [];
    let curr: Node = call;
    // remonte si l'expression parente est aussi un CallExpression
    while (curr.getParent() && Node.isCallExpression(curr.getParent()!)) {
        curr = curr.getParent()!;
        out.push(curr as CallExpression);
    }
    return out;
}

function parseCustomType(name: string, call: CallExpression): ModelMeta {
    const base = getBaseCall(call);
    const arg = base.getArguments()[0];
    if (!Node.isObjectLiteralExpression(arg)) {
        throw new Error(`customType ${name} sans objet`);
    }
    const fields: Field[] = [];
    for (const prop of arg.getProperties()) {
        if (!Node.isPropertyAssignment(prop)) continue;
        const key = prop.getName();
        const init = prop.getInitializer();
        if (!init || !Node.isCallExpression(init)) {
            fields.push({ name: key, kind: "unknown" });
            continue;
        }
        const baseCall = getBaseCall(init);
        const callee = baseCall.getExpression().getText();
        if (callee === "a.string") fields.push({ name: key, kind: "string" });
        else if (callee === "a.integer" || callee === "a.float" || callee === "a.number")
            fields.push({ name: key, kind: "number" });
        else if (callee === "a.boolean") fields.push({ name: key, kind: "boolean" });
        else fields.push({ name: key, kind: "unknown" });
    }
    return { name, type: "customType", fields, assocs: [] };
}

function infer(manifest: ModelMeta[]) {
    const models = manifest.filter((m) => m.type === "model");
    const byName = Object.fromEntries(models.map((m) => [m.name, m]));

    // pivots = exactement 2 belongsTo
    const pivots = models.filter(
        (m) => m.assocs.filter((a) => a.kind === "belongsTo").length === 2
    );

    const relations: Record<string, Record<string, RelationDef>> = {};

    const addRel = (model: string, relName: string, def: RelationDef) => {
        relations[model] ??= {};
        relations[model][relName] = def;
    };

    // N↔N from pivots
    for (const p of pivots) {
        const belongs = p.assocs.filter((a) => a.kind === "belongsTo") as Extract<
            Assoc,
            { kind: "belongsTo" }
        >[];
        const [A, B] = belongs;
        // côté A.model
        addRel(A.target, pluralize(lower(B.target)), {
            kind: "manyToMany",
            through: p.name,
            parentKey: A.fk,
            childKey: B.fk,
            child: B.target,
        });
        // côté B.model
        addRel(B.target, pluralize(lower(A.target)), {
            kind: "manyToMany",
            through: p.name,
            parentKey: B.fk,
            childKey: A.fk,
            child: A.target,
        });
    }

    // 1→N
    for (const m of models) {
        for (const a of m.assocs) {
            if (a.kind !== "hasMany") continue;
            const child = byName[a.target];
            const back = child?.assocs.some(
                (b) => b.kind === "belongsTo" && b.target === m.name && b.fk === a.targetFk
            );
            const isPivot = pivots.some((p) => p.name === a.target);
            if (back && !isPivot) {
                addRel(m.name, pluralize(lower(a.target)), {
                    kind: "hasMany",
                    child: a.target,
                    childFk: a.targetFk,
                });
            }
        }
    }

    return { relations, pivots: pivots.map((p) => p.name) };
}

function lower(s: string) {
    return s.charAt(0).toLowerCase() + s.slice(1);
}
function pluralize(s: string) {
    return s.endsWith("s") ? s : s + "s";
}

function main() {
    const schemaObj = findSchemaObjectLiteral(RESOURCE);
    if (!schemaObj) throw new Error("schema object not found");

    const metas: ModelMeta[] = [];

    for (const prop of schemaObj.getProperties()) {
        if (!Node.isPropertyAssignment(prop)) continue;
        const name = prop.getName();
        const init = prop.getInitializer();
        if (!init) continue;

        const call = resolveCallFromInitializer(init);
        if (!call) continue;

        const baseName = getBaseCalleeName(call);
        if (baseName === "a.model") {
            metas.push(parseModelObject(name, call));
        } else if (baseName === "a.customType") {
            metas.push(parseCustomType(name, call));
        }

        const DEBUG = process.argv.includes("--debug");
        if (DEBUG) {
            console.log(
                "[prop]",
                name,
                "expr=",
                resolveCallFromInitializer(init)?.getExpression().getText(),
                "base=",
                baseName
            );
        }
    }
    console.log("[gen] counted:", {
        models: metas.filter((m) => m.type === "model").length,
        customTypes: metas.filter((m) => m.type === "customType").length,
    });

    // write manifests
    ensureDir(OUT_INTROSPECTION);
    writeJSON(path.join(OUT_INTROSPECTION, "models.manifest.json"), metas);

    const { relations, pivots } = infer(metas);
    writeJSON(path.join(OUT_INTROSPECTION, "relations.manifest.json"), relations);

    // Scaffold code
    scaffoldAll(metas, relations, pivots);
}

function scaffoldAll(
    metas: ModelMeta[],
    relations: Record<string, Record<string, RelationDef>>,
    pivots: string[]
) {
    ensureDir(OUT_MODELS);
    ensureDir(OUT_RELATIONS);

    const modelNames = metas.filter((m) => m.type === "model").map((m) => m.name);
    const isPivot = (name: string) => pivots.includes(name);

    for (const m of metas) {
        if (m.type === "customType") continue;
        if (isPivot(m.name)) {
            scaffoldPivot(m);
        } else {
            scaffoldModel(m, relations[m.name] || {});
        }
    }
}

function scaffoldModel(m: ModelMeta, rels: Record<string, RelationDef>) {
    const dir = path.join(OUT_MODELS, lower(m.name));
    ensureDir(dir);

    // config.ts
    const fieldsConfig = m.fields
        .filter((f) => f.kind !== "unknown")
        .map((f) => {
            if (f.kind === "custom") return `    ${f.name}: { kind: "custom" }`;
            if (f.kind === "enum")
                return `    ${f.name}: { kind: "string" }, // enum: ${f.enumValues?.join("|")}`;
            if (f.kind === "id") return `    ${f.name}: { kind: "string" }, // id`;
            return `    ${f.name}: { kind: "${f.kind}" }`;
        })
        .join(",\n");

    const relsConfig = Object.entries(rels)
        .map(([name, r]) => {
            if (r.kind === "hasMany") {
                return `    ${name}: { kind: "hasMany" }`;
            } else {
                // manyToMany via pivot service to be wired manually (name matches folder)
                return `    ${name}: { kind: "manyToMany", through:  "${r.through}Service", parentKey: "${r.parentKey}", childKey: "${r.childKey}" }`;
            }
        })
        .join(",\n");

    const configTs = `import { defineEntity } from "@entities/core/defineEntity";
export const ${lower(m.name)}Config = defineEntity({
  model: "${m.name}",
  fields: {
${fieldsConfig}
  },
  relations: {
${relsConfig}
  }
});
`;
    safeWrite(path.join(dir, "config.ts"), configTs);

    // service.ts
    const serviceTs = `import { crudService } from "@entities/core/services/crudService";
export const ${lower(m.name)}Service = crudService("${m.name}");
`;
    safeWrite(path.join(dir, "service.ts"), serviceTs);

    // form.ts
    const formTs = `import { createModelForm } from "@entities/core";
import type { ${m.name}Type, ${m.name}FormType, ${m.name}TypeOmit } from "./types";

export const initial${m.name}Form: ${m.name}FormType = {} as ${m.name}FormType;
function to${m.name}Form(model: ${m.name}Type): ${m.name}FormType {
  void model;
  return initial${m.name}Form;
}
function to${m.name}Input(form: ${m.name}FormType): ${m.name}TypeOmit {
  return form as ${m.name}TypeOmit;
}

export const ${lower(m.name)}Form = createModelForm<${m.name}Type, ${m.name}FormType, [], ${m.name}TypeOmit>(
  initial${m.name}Form,
  to${m.name}Form,
  to${m.name}Input
);
`;
    safeWrite(path.join(dir, "form.ts"), formTs);

    // hooks.ts
    const hooksTs = `import { createEntityHooks } from "@entities/core/createEntityHooks";
import { ${lower(m.name)}Config } from "./config";
export const { useManager: use${m.name}Manager, service: ${lower(m.name)}Service2, form: ${lower(m.name)}Form2 } = createEntityHooks(${lower(m.name)}Config);
`;
    safeWrite(path.join(dir, "hooks.ts"), hooksTs);

    // index.ts
    const indexTs = `export * from "./config";
export * from "./service";
export * from "./form";
export * from "./hooks";
`;
    safeWrite(path.join(dir, "index.ts"), indexTs);
}

function scaffoldPivot(m: ModelMeta) {
    const dir = path.join(OUT_RELATIONS, lower(m.name));
    ensureDir(dir);

    // Expect two belongsTo
    const belongs = m.assocs.filter((a) => a.kind === "belongsTo") as Extract<
        Assoc,
        { kind: "belongsTo" }
    >[];
    if (belongs.length !== 2) {
        console.warn("Pivot attendu 2 belongsTo:", m.name);
        return;
    }
    const a = belongs[0],
        b = belongs[1];

    const serviceTs = `import { relationService } from "@src/entities/services/relationService";
export const ${lower(m.name)}Service = relationService("${m.name}", "${a.fk}", "${b.fk}");
`;
    safeWrite(path.join(dir, "service.ts"), serviceTs);

    const typesTs = `// types pour ${m.name} (pivot)
export type ${m.name}Id = { ${a.fk}: string; ${b.fk}: string };
`;
    safeWrite(path.join(dir, "types.ts"), typesTs);

    const indexTs = `export * from "./service";
export * from "./types";
`;
    safeWrite(path.join(dir, "index.ts"), indexTs);
}

main();

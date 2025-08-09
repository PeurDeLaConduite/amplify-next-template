// scripts/generator/parse/parseSchema.ts
import path from "node:path";
import { Project, Node, ObjectLiteralExpression, CallExpression, SourceFile } from "ts-morph";
import type { Assoc, Field, ModelMeta } from "../types"; // adapte le chemin si besoin

export function parseSchema(
    opts: {
        root?: string;
        resourceRel?: string;
        tsconfigRel?: string;
        debug?: boolean;
    } = {} // <= défaut pour éviter le destructuring sur undefined
) {
    const {
        root = process.cwd(),
        resourceRel = "amplify/data/resource.ts",
        tsconfigRel = "tsconfig.json",
        debug = false,
    } = opts;

    const RESOURCE = path.join(root, resourceRel);
    const TSCONFIG = path.join(root, tsconfigRel);

    const project = new Project({
        tsConfigFilePath: TSCONFIG,
        skipAddingFilesFromTsConfig: true,
    });

    const sf = project.addSourceFileAtPath(RESOURCE);
    const schemaObj = findSchemaObjectLiteral(sf);
    const metas: ModelMeta[] = [];
    const seen = new Set<string>(); // `${type}|${name}`

    for (const prop of schemaObj.getProperties()) {
        if (!Node.isPropertyAssignment(prop)) continue;
        const name = prop.getName();
        const init = prop.getInitializer();
        if (!init) continue;

        const call = resolveCallFromInitializer(init);
        if (!call) continue;

        const baseName = getBaseCalleeName(call); // "a.model" | "a.customType"

        if (debug) {
            console.log("[prop]", name, "expr=", call.getExpression().getText(), "base=", baseName);
        }

        if (baseName === "a.model") {
            const meta = parseModelObject(name, call);
            pushUnique(metas, seen, meta);
        } else if (baseName === "a.customType") {
            const meta = parseCustomType(name, call);
            pushUnique(metas, seen, meta);
        }
    }

    return metas;
}

/* ---------------- helpers: AST traversal ---------------- */

function findSchemaObjectLiteral(sf: SourceFile): ObjectLiteralExpression {
    const decl = sf.getVariableDeclarationOrThrow("schema");
    const init = decl.getInitializerOrThrow();
    if (!Node.isCallExpression(init)) throw new Error("schema n'est pas un CallExpression");
    const exprTxt = init.getExpression().getText().replace(/\s+/g, "");
    if (exprTxt !== "a.schema") throw new Error("schema n'est pas initialisé via a.schema(...)");
    const arg = init.getArguments()[0];
    if (!Node.isObjectLiteralExpression(arg))
        throw new Error("a.schema(...) n'a pas un objet en 1er argument");
    return arg;
}

// descend à l'appel "de base": a.model(...) / a.customType(...)
function getBaseCall(call: CallExpression): CallExpression {
    let curr: CallExpression = call;
    while (true) {
        const expr = curr.getExpression();
        if (Node.isPropertyAccessExpression(expr)) {
            const inner = expr.getExpression();
            if (Node.isCallExpression(inner)) {
                curr = inner;
                continue;
            }
        }
        break;
    }
    return curr;
}

function getBaseCalleeName(call: CallExpression): "a.model" | "a.customType" | string {
    const base = getBaseCall(call);
    const expr = base.getExpression();
    if (Node.isPropertyAccessExpression(expr)) {
        const left = expr.getExpression().getText().replace(/\s+/g, "");
        const right = expr.getName();
        return `${left}.${right}`;
    }
    return expr.getText().replace(/\s+/g, "");
}

// si l'initializer est un identifiant (const todoModel = a.model(...)), on le résout
function resolveCallFromInitializer(init: Node): CallExpression | null {
    if (Node.isCallExpression(init)) return init;
    if (Node.isIdentifier(init)) {
        const decl = init.getSymbol()?.getDeclarations()?.[0];
        // @ts-ignore - guard souple
        const dInit = decl?.getInitializer?.();
        if (Node.isCallExpression(dInit)) return dInit;
    }
    return null;
}

// remonte la chaîne et détecte .required()
function hasRequired(call: CallExpression): boolean {
    const isRequiredExpr = (n: Node) => {
        if (!Node.isCallExpression(n)) return false;
        const e = n.getExpression();
        return Node.isPropertyAccessExpression(e) && e.getName() === "required";
    };
    if (isRequiredExpr(call)) return true;

    let curr: Node = call;
    while (true) {
        const parent = curr.getParent();
        if (!parent) return false;

        if (Node.isPropertyAccessExpression(parent)) {
            const maybeCall = parent.getParent();
            if (maybeCall && Node.isCallExpression(maybeCall)) {
                if (isRequiredExpr(maybeCall)) return true;
                curr = maybeCall;
                continue;
            }
            curr = parent;
            continue;
        }
        if (Node.isCallExpression(parent)) {
            if (isRequiredExpr(parent)) return true;
            curr = parent;
            continue;
        }
        return false;
    }
}

// collecte a.model(...).identifier([...]) etc.
function collectChainedCalls(call: CallExpression): CallExpression[] {
    const out: CallExpression[] = [];
    let curr: Node = call;
    while (true) {
        const parent = curr.getParent();
        if (!parent) break;

        if (Node.isPropertyAccessExpression(parent)) {
            const maybeCall = parent.getParent();
            if (maybeCall && Node.isCallExpression(maybeCall)) {
                out.push(maybeCall);
                curr = maybeCall;
                continue;
            }
            curr = parent;
            continue;
        }
        if (Node.isCallExpression(parent)) {
            out.push(parent);
            curr = parent;
            continue;
        }
        break;
    }
    return out;
}

function asString(node: Node | undefined): string | undefined {
    if (!node) return;
    if (Node.isStringLiteral(node)) return node.getLiteralText();
    return undefined;
}

/* ---------------- parse: model & customType ---------------- */

function parseModelObject(name: string, call: CallExpression): ModelMeta {
    const base = getBaseCall(call);

    const arg = base.getArguments()[0];
    if (!Node.isObjectLiteralExpression(arg)) throw new Error(`model ${name} sans objet`);

    // identifier([...])
    let identifier: string[] | undefined;
    for (const chained of collectChainedCalls(base)) {
        const exprText = chained.getExpression().getText();
        if (exprText.endsWith(".identifier")) {
            const arr = chained.getArguments()[0];
            if (Node.isArrayLiteralExpression(arr)) {
                identifier = arr.getElements().map((e) => e.getText().replace(/['"`]/g, ""));
            }
        }
    }

    const fields: Field[] = [];
    const assocs: Assoc[] = [];

    for (const prop of arg.getProperties()) {
        if (!Node.isPropertyAssignment(prop)) continue;
        const key = prop.getName();
        const init = prop.getInitializer();

        if (!init || !Node.isCallExpression(init)) {
            fields.push({ name: key, kind: "unknown" });
            continue;
        }

        const baseField = getBaseCall(init);
        const callee = baseField.getExpression().getText();

        // associations
        if (callee === "a.hasMany") {
            const target = asString(baseField.getArguments()[0]);
            const fk = asString(baseField.getArguments()[1]);
            if (target && fk) assocs.push({ kind: "hasMany", target, targetFk: fk });
            continue;
        }
        if (callee === "a.belongsTo") {
            const target = asString(baseField.getArguments()[0]);
            const fk = asString(baseField.getArguments()[1]);
            if (target && fk) assocs.push({ kind: "belongsTo", target, fk });
            continue;
        }

        // champs simples
        const required = hasRequired(init);
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
            const arg0 = baseField.getArguments()[0];
            let enumValues: string[] | undefined;
            if (Node.isArrayLiteralExpression(arg0)) {
                enumValues = arg0.getElements().map((e) => e.getText().replace(/['"`]/g, ""));
            }
            fields.push({ name: key, kind: "enum", enumValues, required });
            continue;
        }
        if (callee === "a.ref") {
            const ref = asString(baseField.getArguments()[0]);
            fields.push({ name: key, kind: "custom", refType: ref, required });
            continue;
        }

        fields.push({ name: key, kind: "unknown" });
    }

    return { name, type: "model", fields, assocs, identifier };
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

        const baseField = getBaseCall(init);
        const callee = baseField.getExpression().getText();
        if (callee === "a.string") fields.push({ name: key, kind: "string" });
        else if (callee === "a.integer" || callee === "a.float" || callee === "a.number")
            fields.push({ name: key, kind: "number" });
        else if (callee === "a.boolean") fields.push({ name: key, kind: "boolean" });
        else fields.push({ name: key, kind: "unknown" });
    }

    return { name, type: "customType", fields, assocs: [] };
}

/* ---------------- utils ---------------- */

function pushUnique(out: ModelMeta[], seen: Set<string>, meta: ModelMeta) {
    const key = `${meta.type}|${meta.name}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(meta);
}

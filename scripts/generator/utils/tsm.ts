// scripts/generator/utils/tsm.ts
import { Project, Node, ObjectLiteralExpression, CallExpression } from "ts-morph";
import { ROOT } from "./fs";

export function loadResourceObjectLiteral(resourceAbsPath: string): ObjectLiteralExpression {
    const project = new Project({
        tsConfigFilePath: `${ROOT}/tsconfig.json`,
        skipAddingFilesFromTsConfig: true,
    });
    project.addSourceFileAtPath(resourceAbsPath);
    const sf = project.getSourceFileOrThrow(resourceAbsPath);

    const decl = sf.getVariableDeclarationOrThrow("schema");
    const init = decl.getInitializerOrThrow();
    if (!Node.isCallExpression(init)) throw new Error("schema n'est pas un CallExpression");
    if (init.getExpression().getText() !== "a.schema") throw new Error("schema != a.schema(...)");
    const arg = init.getArguments()[0];
    if (!Node.isObjectLiteralExpression(arg)) throw new Error("a.schema(...) sans objet");
    return arg;
}

export function getBaseCall(call: CallExpression): CallExpression {
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

export function getBaseCalleeName(call: CallExpression): string {
    const expr = getBaseCall(call).getExpression();
    if (Node.isPropertyAccessExpression(expr)) {
        const left = expr.getExpression().getText().replace(/\s+/g, "");
        const right = expr.getName();
        return `${left}.${right}`;
    }
    return expr.getText().replace(/\s+/g, "");
}

export function resolveCallFromInitializer(init: Node): CallExpression | null {
    if (Node.isCallExpression(init)) return init;
    if (Node.isIdentifier(init)) {
        const decl = init.getSymbol()?.getDeclarations()?.[0];
        // @ts-expect-error directive to explain why
        const dInit = decl?.getInitializer?.();
        if (dInit && Node.isCallExpression(dInit)) return dInit;
    }
    return null;
}

export function asString(node: Node | undefined): string | undefined {
    if (!node) return;
    if (Node.isStringLiteral(node)) return node.getLiteralText();
}

export function hasRequired(call: CallExpression): boolean {
    // 1) si l'appel courant EST déjà `.required()`
    const expr = call.getExpression();
    if (Node.isPropertyAccessExpression(expr) && expr.getName() === "required") {
        return true;
    }

    // 2) sinon, remonte la chaîne (call <- propertyAccess <- call ...)
    let curr: Node = call;
    while (true) {
        const parent = curr.getParent();
        if (!parent) return false;

        if (Node.isPropertyAccessExpression(parent)) {
            const maybeCall = parent.getParent();
            if (maybeCall && Node.isCallExpression(maybeCall)) {
                const e = maybeCall.getExpression();
                if (Node.isPropertyAccessExpression(e) && e.getName() === "required") return true;
                curr = maybeCall;
                continue;
            }
            curr = parent;
            continue;
        }

        if (Node.isCallExpression(parent)) {
            const e = parent.getExpression();
            if (Node.isPropertyAccessExpression(e) && e.getName() === "required") return true;
            curr = parent;
            continue;
        }

        return false;
    }
}

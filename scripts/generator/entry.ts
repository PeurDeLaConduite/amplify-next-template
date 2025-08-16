import path from "node:path";
import { spawn } from "node:child_process";
import { parseSchema } from "./parse/parseSchema";
import { inferRelations } from "./parse/inferRelations";
import { ensureDir, writeJSON } from "./utils/fs";
import { renderModel } from "./render/renderModel";
import { renderPivot } from "./render/renderPivot";
import { renderCustomType } from "./render/renderCustomType";
import { GEN } from "./generator.config";
// ❌ import { execa } from "execa";  // supprimé

async function runPrettier(args: string[], cwd: string) {
    // Utilise le runner Node et le binaire JS de Prettier (évite .cmd / shell)
    const prettierCli = require.resolve("prettier/bin/prettier.cjs");
    const safeArgs = args.filter(Boolean); // au cas où un chemin serait undefined

    await new Promise<void>((resolve, reject) => {
        const cp = spawn(process.execPath, [prettierCli, ...safeArgs], {
            cwd,
            stdio: "inherit",
            shell: false,
        });
        cp.on("error", reject);
        cp.on("exit", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`prettier exited with code ${code}`));
        });
    });
}

async function main() {
    const ROOT = process.cwd();
    const metas = parseSchema({
        root: ROOT,
        resourceRel: GEN.schemaRel,
        tsconfigRel: GEN.tsconfigRel,
        debug: false,
    });

    await ensureDir(path.join(ROOT, GEN.out.introspection));
    await writeJSON(path.join(ROOT, GEN.out.introspection, "schema.json"), metas);

    // Inject implicit id for non-composite models
    for (const m of metas) {
        if (m.type !== "model") continue;
        const hasComposite =
            Array.isArray((m as any).identifier) && (m as any).identifier.length > 0;
        const hasId = m.fields.some((f) => (f as any).name === "id" && (f as any).kind === "id");
        if (!hasComposite && !hasId)
            (m as any).fields.unshift({ name: "id", kind: "id", required: true });
    }

    const { relations, pivots } = inferRelations(metas as any);

    await ensureDir(path.join(ROOT, GEN.out.introspection));
    await ensureDir(path.join(ROOT, GEN.out.models));
    await ensureDir(path.join(ROOT, GEN.out.customTypes));
    await ensureDir(path.join(ROOT, GEN.out.relations));

    await writeJSON(path.join(ROOT, GEN.out.introspection, "models.manifest.json"), metas);
    await writeJSON(path.join(ROOT, GEN.out.introspection, "relations.manifest.json"), relations);

    for (const ct of metas.filter((m) => m.type === "customType")) renderCustomType(ct as any);
    for (const m of metas.filter(
        (m) => m.type === "model" && (pivots as string[]).includes(m.name)
    ))
        renderPivot(m as any, path.join(ROOT, GEN.out.relations));
    for (const m of metas.filter(
        (m) => m.type === "model" && !(pivots as string[]).includes(m.name)
    ))
        renderModel(m as any, relations as any);

    await runPrettier(["--write", GEN.out.models, GEN.out.customTypes, GEN.out.relations], ROOT);

    console.log("✅ Generation done.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

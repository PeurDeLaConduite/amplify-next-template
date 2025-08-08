#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const AUDIT_DIR = path.join(ROOT, "audit");
const OUT_JSON = path.join(AUDIT_DIR, "summary.json");
const OUT_MD = path.join(AUDIT_DIR, "summary.md");

// Helpers
const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const write = (p, content) => fs.writeFileSync(p, content, "utf8");
const ensure = (p) => fs.mkdirSync(p, { recursive: true });

// Load inputs
ensure(AUDIT_DIR);
const files = {
    index: read(path.join(AUDIT_DIR, "index_hits.txt")),
    hooks: read(path.join(AUDIT_DIR, "hooks.txt")),
    services: read(path.join(AUDIT_DIR, "services.txt")),
    forms: read(path.join(AUDIT_DIR, "forms.txt")),
    auth: read(path.join(AUDIT_DIR, "auth.txt")),
    circular: read(path.join(AUDIT_DIR, "circular.txt")),
    deps: read(path.join(AUDIT_DIR, "deps.json")),
};

// Basic parse of ripgrep-ish lines: "path:line: content"
function parseLines(txt) {
    return txt
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
            const m = line.match(/^(.+?):(\d+):\s?(.*)$/);
            if (!m) return null;
            return { file: m[1].replaceAll("\\", "/"), line: Number(m[2]), text: m[3] };
        })
        .filter(Boolean);
}

// Guess “entity” from path like src/entities/models/<entity>/...
function inferEntity(file) {
    const parts = file.replaceAll("\\", "/").split("/");
    const idx = parts.findIndex((p) => p === "models");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    // fallback: try src/entities/<entity>/
    const idx2 = parts.findIndex((p) => p === "entities");
    if (idx2 >= 0 && parts[idx2 + 1] && parts[idx2 + 1] !== "models") return parts[idx2 + 1];
    return "unknown";
}

// Collect raw hits
const hits = {
    index: parseLines(files.index),
    hooks: parseLines(files.hooks),
    services: parseLines(files.services),
    forms: parseLines(files.forms),
    auth: parseLines(files.auth),
};

// Build per-entity buckets
const entities = new Map(); // entity -> { files:Set, forms:[], services:[], hooks:[], auth:[], index:[] }
function touchEntity(name) {
    if (!entities.has(name)) {
        entities.set(name, {
            files: new Set(),
            index: [],
            forms: [],
            services: [],
            hooks: [],
            auth: [],
            summary: { hasConfig: false, hasForm: false, hasService: false, hasHook: false },
        });
    }
    return entities.get(name);
}

function bucketize(arr, key) {
    for (const h of arr) {
        const ent = touchEntity(inferEntity(h.file));
        ent[key].push(h);
        ent.files.add(h.file);
    }
}
bucketize(hits.index, "index");
bucketize(hits.forms, "forms");
bucketize(hits.services, "services");
bucketize(hits.hooks, "hooks");
bucketize(hits.auth, "auth");

// Enrich summaries
for (const [name, ent] of entities) {
    const files = [...ent.files];
    ent.summary.hasConfig = files.some((f) => /\/config\.ts$/.test(f));
    ent.summary.hasForm = files.some((f) => /\/form\.ts$/.test(f));
    ent.summary.hasService = files.some((f) => /\/service\.ts$/.test(f)) || ent.services.length > 0;
    ent.summary.hasHook = files.some((f) => /\/hooks?\.tsx?$/.test(f)) || ent.hooks.length > 0;
}

// Parse deps.json (dependency-cruiser)
let deps = { modules: [] };
try {
    deps = JSON.parse(files.deps || "{}");
} catch {}
const edges = new Map(); // file -> [imports...]
if (deps?.modules?.length) {
    for (const m of deps.modules) {
        const from = (m.source || m.name || "").replaceAll("\\", "/");
        if (!from) continue;
        const list = [];
        (m.dependencies || []).forEach((d) => {
            const to = (d.resolved || d.module || "").replaceAll("\\", "/");
            if (to) list.push(to);
        });
        edges.set(from, list);
    }
}

// Heuristic red flags
function redFlagsForEntity(name, ent) {
    const flags = [];

    // 1) Direct client.models usage (bypass crudService)
    const directClient = ent.services.filter((h) => /client\.models\./i.test(h.text));
    if (directClient.length) {
        flags.push({
            kind: "service-bypass",
            message: "Appel direct à client.models.* au lieu de crudService",
            samples: directClient.slice(0, 5),
        });
    }

    // 2) UI leaking owner/sub
    const uiOwner = ent.auth.filter(
        (h) =>
            /owner|cognito:groups|ADMINS|sub/i.test(h.text) &&
            /components|app\/|pages\//i.test(h.file)
    );
    if (uiOwner.length) {
        flags.push({
            kind: "ui-auth-leak",
            message: "Logique d'auth (owner/ADMINS) présente dans l'UI (à déplacer en service)",
            samples: uiOwner.slice(0, 5),
        });
    }

    // 3) Form not reused in hooks/services
    if (ent.summary.hasForm && ent.hooks.length === 0 && ent.services.length === 0) {
        flags.push({
            kind: "form-unused",
            message: "Form défini mais non réutilisé par hook/service",
            samples: ent.forms.slice(0, 3),
        });
    }

    // 4) Potential circular deps (use madge text)
    const circularText = files.circular || "";
    const entHasCycle = circularText.includes(name);
    if (entHasCycle) {
        flags.push({
            kind: "circular",
            message: "Présence potentielle de cycle (vérifier circular.txt)",
        });
    }

    return flags;
}

// Build final summary structure
const out = {
    generatedAt: new Date().toISOString(),
    totals: {
        entities: entities.size,
        hooks: hits.hooks.length,
        services: hits.services.length,
        forms: hits.forms.length,
    },
    entities: [],
};

for (const [name, ent] of entities) {
    out.entities.push({
        name,
        files: [...ent.files].sort(),
        counts: {
            index: ent.index.length,
            forms: ent.forms.length,
            services: ent.services.length,
            hooks: ent.hooks.length,
            authRefs: ent.auth.length,
        },
        summary: ent.summary,
        redFlags: redFlagsForEntity(name, ent),
        examples: {
            hooks: ent.hooks.slice(0, 5),
            services: ent.services.slice(0, 5),
            forms: ent.forms.slice(0, 5),
            auth: ent.auth.slice(0, 5),
        },
    });
}

// Markdown rendering
function md() {
    const lines = [];
    lines.push(`# Audit — Résumé`);
    lines.push(`Généré: ${out.generatedAt}`);
    lines.push(
        `Totaux: entités=${out.totals.entities}, hooks=${out.totals.hooks}, services=${out.totals.services}, forms=${out.totals.forms}`
    );
    lines.push("");

    // Entities table
    lines.push(
        `| Entité | hasConfig | hasForm | hasService | hasHook | #forms | #services | #hooks | #authRefs | Flags |`
    );
    lines.push(`|---|:---:|:---:|:---:|:---:|---:|---:|---:|---:|---|`);

    for (const e of out.entities.sort((a, b) => a.name.localeCompare(b.name))) {
        const flags = e.redFlags.map((f) => f.kind).join(", ");
        lines.push(
            `| ${e.name} | ${e.summary.hasConfig ? "✔" : "—"} | ${e.summary.hasForm ? "✔" : "—"} | ${e.summary.hasService ? "✔" : "—"} | ${e.summary.hasHook ? "✔" : "—"} | ${e.counts.forms} | ${e.counts.services} | ${e.counts.hooks} | ${e.counts.authRefs} | ${flags || "—"} |`
        );
    }

    lines.push("");
    for (const e of out.entities.sort((a, b) => a.name.localeCompare(b.name))) {
        lines.push(`## ${e.name}`);
        if (e.files.length) {
            lines.push(
                `<details><summary>Fichiers</summary>\n\n${e.files.map((f) => `- ${f}`).join("\n")}\n\n</details>`
            );
        }
        if (e.redFlags.length) {
            lines.push(`**Red flags**:`);
            e.redFlags.forEach((rf) => {
                lines.push(`- ${rf.kind}: ${rf.message}`);
            });
        } else {
            lines.push(`Aucun red flag détecté par les heuristiques.`);
        }
        lines.push("");
    }

    return lines.join("\n");
}

// Write outputs
write(OUT_JSON, JSON.stringify(out, null, 2));
write(OUT_MD, md());

console.log("✅ Fini.");
console.log(`- ${path.relative(ROOT, OUT_JSON)}`);
console.log(`- ${path.relative(ROOT, OUT_MD)}`);
